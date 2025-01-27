/** 
 * Development guide: Controlling signals
 * https://docs.superpowered.com/guides/controlling-signals/?lang=js
 */


import { useEffectOnce } from 'react-use';

// The location of the processor from the browser to fetch.
const sineToneProcessorUrl = "/sineToneProcessor-v3.js";
const minimumSampleRate = 48000;

export const useSuper = (): any => {
  let webaudioManager: any = null;
  let superpowered: any = null;
  let generatorProcessorNode: any = null;

  const boot = async () => {
    await setupSuperpowered();
    await loadProcessor();
  }

  const onMessageProcessorAudioScope = (message: any) => {
    // console.log(message);
    // Here is where we receive serialisable message from the audio scope.
    // We're sending our own ready event payload when the proeccesor is fully innitialised
    if (message.event === "ready") {
      console.log('ready');
    }
  };

  const setupSuperpowered = async () => {
    const { SuperpoweredGlue, SuperpoweredWebAudio } = await import('@superpoweredsdk/web');

    superpowered = await SuperpoweredGlue.Instantiate(
      'ExampleLicenseKey-WillExpire-OnNextUpdate'
    );
    webaudioManager = new SuperpoweredWebAudio(
      minimumSampleRate,
      superpowered
    );
    console.log(`Running Superpowered v${superpowered.Version()}`);
  }

  const loadProcessor = async () => {
    // Now create the AudioWorkletNode, passing in the AudioWorkletProcessor url, it's registered name (defined inside the processor) and a callback then gets called when everything is up a ready
    generatorProcessorNode = await webaudioManager.createAudioNodeAsync(
      sineToneProcessorUrl,
      "SineToneProcessor",
      onMessageProcessorAudioScope
    );

    // Connect the AudioWorkletNode to the WebAudio destination (speakers);
    generatorProcessorNode.connect(
      webaudioManager.audioContext.destination
    );
    webaudioManager.audioContext.suspend();
  }

  const resumeContext = () => {
    console.log("resuming");
    webaudioManager.audioContext.resume();
  }

  const onParamChange = (id: any, value: any) => {
    // console.log('onParamChange', id, value);
    // First, we update the label in the dom with the new value.
    // document.getElementById(id).innerHTML = value;

    // Then we send the parameter id and value over to the audio thread via sendMessageToAudioScope.
    generatorProcessorNode.sendMessageToAudioScope({
      type: "parameterChange",
      payload: {
        id,
        value: Number(value) // we are typecasting here to keep the processor script as clean as possible
      }
    });
};

  useEffectOnce(() => {
    boot()
  })

  return {
    resumeContext,
    onParamChange
  }
}
