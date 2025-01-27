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
    console.log("onMessageFromMainScope", message);

    if (message.type === "bufferTransfer") {
      this.playAudioBuffer(message.payload.buffer);
    }
  }

  playAudioBuffer(audioBuffer) {
    const audioFileInWASMHeap = this.convertToLinearMemory(audioBuffer);
    const decodedAudioPointer = this.decodeAudio(
      audioFileInWASMHeap,
      audioBuffer
    );
    this.loadAudioIntoPlayer(decodedAudioPointer);
    this.playAudio();
  }

  convertToLinearMemory(audioBuffer) {
    console.log("convertToLinearMemory", audioBuffer);
    // Copy the ArrayBuffer to WebAssembly Linear Memory.
    return this.Superpowered.arrayBufferToWASM(audioBuffer);
  }

  decodeAudio(audiofileInWASMHeap, audiofileArrayBuffer) {
    console.log("decodeAudio", audiofileInWASMHeap, audiofileArrayBuffer);
    // Decode the entire file. Returns a pointer
    return this.Superpowered.Decoder.decodeToAudioInMemory(
      audiofileInWASMHeap,
      audiofileArrayBuffer.byteLength
    );
  }

  loadAudioIntoPlayer(decodedAudioPointer) {
    // Once we have the pointer to the buffer, we pass the decoded audio into the AAP instance.
    this.player.openMemory(decodedAudioPointer, false, false);
  }

  playAudio() {
    // Play the audio once loaded. (optional of course).
    this.player.play();
    console.log("superpowered.linearMemory1", this.Superpowered.linearMemory);
    console.log("superpowered.linearMemory2", this.player.linearMemory);
  }

  // onDestruct is called when the parent destruct() method is called.
  // You should clear up all Superpowered object instances here.
  onDestruct() {
    this.player.destruct();
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
