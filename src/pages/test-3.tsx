// // Make sure to include the version number here to prevent compatability issues with your AudioWorklets!
// import { SuperpoweredGlue, SuperpoweredWebAudio } from "@superpoweredsdk/web";

import { useSuper } from "@/hook/use-super-v3";

function ModuleTest() {
  const { enabledControls, resumeContext, onParamChange, loadTrack } =
    useSuper();

  return (
    <div className="bg-blue-500">
      <h1>Teste 3 - Controlling signals</h1>
      <br />
      <button onClick={resumeContext}>Resume Context (Play)</button>
      <br />
      <br />
      <div id="bootedControls">
        <label>Osc 1 Volume</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          onInput={(e) => onParamChange("osc1Vol", e.currentTarget.value)}
        />
        <label>Osc 1 Frequency</label>
        <input
          type="range"
          min="20"
          max="2000"
          step="0.1"
          onInput={(e) => onParamChange("osc1Freq", e.currentTarget.value)}
        />

        <br />
        <br />

        <label>Osc 2 Volume</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          onInput={(e) => onParamChange("osc2Vol", e.currentTarget.value)}
        />
        <label>Osc 2 Frequency</label>
        <input
          type="range"
          min="20"
          max="2000"
          step="0.1"
          onInput={(e) => onParamChange("osc2Freq", e.currentTarget.value)}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ModuleTest />
    </div>
  );
}
