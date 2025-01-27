import { SuperpoweredWebAudio } from "./Superpowered.js";

class SineToneProcessor extends SuperpoweredWebAudio.AudioWorkletProcessor {
  // Runs after the constructor
  onReady() {
    this.player = new this.Superpowered.AdvancedAudioPlayer(
      this.samplerate,
      2,
      2,
      0,
      0.501,
      2,
      false
    );
    this.player.loopOnEOF = true;
    this.playerGain = 1;

    // Notify the main scope that we're prepared.
    this.sendMessageToMainScope({ event: "ready" });
  }

  // Messages are received from the main scope through this method.
  onMessageFromMainScope(message) {
    if (message.type === "parameterChange") {
      if (message.payload.id === "localPlayerVolume") {
        this.playerGain = message.payload.value;
      } else if (message.payload.id === "localPlayerRate") {
        this.player.playbackRate = message.payload.value;
      } else if (message.payload.id === "localPlayerPitch") {
        this.player.pitchShiftCents = message.payload.value;
      }
    }

    if (message.SuperpoweredLoaded) {
      console.log(
        "message.SuperpoweredLoaded",
        message.SuperpoweredLoaded.buffer
      );

      this.player.pause();
      this.sampleLoaded = true;
      this.player.openMemory(
        this.Superpowered.arrayBufferToWASM(message.SuperpoweredLoaded.buffer),
        false,
        false
      );
      this.player.seek(0);
      this.player.play();
      this.sendMessageToMainScope({ event: "assetLoaded" });
    }
  }

  // onDestruct is called when the parent destruct() method is called.
  // You should clear up all Superpowered object instances here.
  onDestruct() {
    // this.generator1.destruct();
    // this.generator2.destruct();
    // this.mixer.destruct();
    // this.gen1OutputBuffer.free();
    // this.gen2OutputBuffer.free();
    // this.monoMixerOutputBuffer.free();
  }

  processAudio(inputBuffer, outputBuffer, buffersize, parameters) {
    // Ensure the samplerate is in sync on every audio processing callback.
    this.player.outputSamplerate = this.samplerate;

    // Render into the output buffer.
    if (
      !this.player.processStereo(
        outputBuffer.pointer,
        false,
        buffersize,
        this.playerGain
      )
    ) {
      // If no player output, set output to 0s.
      this.Superpowered.memorySet(outputBuffer.pointer, 0, buffersize * 8); // 8 bytes for each frame (1 channel is 4 bytes, two channels)
    }
  }
}

// The following code registers the processor script in the browser, notice the label and reference
if (typeof AudioWorkletProcessor !== "undefined")
  registerProcessor("SineToneProcessor", SineToneProcessor);
export default SineToneProcessor;
