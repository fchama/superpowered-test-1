// // Make sure to include the version number here to prevent compatability issues with your AudioWorklets!
// import { SuperpoweredGlue, SuperpoweredWebAudio } from "@superpoweredsdk/web";

import { useSuper } from "@/hook/use-super-v4";

function ModuleTest() {
  const { enabledControls, resumeContext, onParamChange, loadTrack } =
    useSuper();

  return (
    <div className="bg-blue-500">
      <h1>Teste 4 - Loading and playing audio</h1>
      <br />
      <br />
      <div>
        <strong>Loading and playing audio</strong>
        <br />
        <button id="loadAssetButton" onClick={loadTrack}>
          Load and play local track
        </button>
        <h3 id="trackLoadStatus"></h3>
        <div id="bootedControls">
          <span>Player volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            // defaultValue="0.5"
            onInput={(e) =>
              onParamChange("localPlayerVolume", e.currentTarget.value)
            }
          />
          <span>Playback rate</span>
          <input
            type="range"
            min="0.003"
            max="2"
            step="0.001"
            // defaultValue="1"
            onInput={(e) =>
              onParamChange("localPlayerRate", e.currentTarget.value)
            }
          />
        </div>
        <span>Playback pitch</span>
        <input
          type="range"
          min="-1200"
          max="1200"
          step="1"
          // defaultValue="0"
          onInput={(e) =>
            onParamChange("localPlayerPitch", e.currentTarget.value)
          }
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
