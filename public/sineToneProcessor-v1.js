import { SuperpoweredWebAudio } from "./Superpowered.js";

class SineToneProcessor extends SuperpoweredWebAudio.AudioWorkletProcessor {
  // Runs after the constructor
  onReady() {
    // Create an instance of a SP generator class.
    this.generator = new this.Superpowered.Generator(
      this.samplerate, // The initial sample rate in Hz. this.samplerate is inherited from the extended SuperpoweredWebAudio.AudioWorkletProcessor class.
      this.Superpowered.Generator.Sine // The initial shape.
    );

    this.generator.frequency = 440; // Generate a simple test tone at A4.

    this.genOutputBuffer = new this.Superpowered.Float32Buffer(2048); // An empty array to store the mono output of the generator.

    // Pass an event object over to the main scope to tell it everything is ready.
    // This is the callback defined as the final argument in webaudioManager.createAudioNodeAsync in the main thread.
    // Here we use it to tell the main thread that audio I/O is ready and processing audio.
    this.sendMessageToMainScope({ event: "ready" });
  }

  // onDestruct is called when the parent destruct() method is called.
  // You should clear up all Superpowered object instances here.
  onDestruct() {
    this.generator.destruct();
  }

  processAudio(inputBuffer, outputBuffer, buffersize, parameters) {
    // Generates the next chunk of the sine wave.
    this.generator.generate(
      this.genOutputBuffer.pointer, // Output, pointer to floating point numbers. 32-bit MONO output.
      buffersize // Number of frames.
    );

    // Next we need to convert the mono output of the generator into the interleaved stereo format that the AudioContext expects.
    this.Superpowered.Interleave(
      this.genOutputBuffer.pointer, // Left mono input.
      this.genOutputBuffer.pointer, // Right mono input.
      outputBuffer.pointer, // Stereo output - this is routed to the AudioWorkletProcessor output.
      buffersize // Number of frames.
    );
  }
}

// The following code registers the processor script in the browser, notice the label and reference
if (typeof AudioWorkletProcessor !== "undefined")
  registerProcessor("SineToneProcessor", SineToneProcessor);
export default SineToneProcessor;
