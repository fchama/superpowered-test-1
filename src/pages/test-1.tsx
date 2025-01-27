// // Make sure to include the version number here to prevent compatability issues with your AudioWorklets!
// import { SuperpoweredGlue, SuperpoweredWebAudio } from "@superpoweredsdk/web";

import { useSuper } from "@/hook/use-super-v1";

function ModuleTest() {
  const { enabledControls, resumeContext, onParamChange, loadTrack } =
    useSuper();

  return (
    <div className="bg-blue-500">
      <h1>Teste 1</h1>
      <br />
      <button onClick={resumeContext}>Resume Context (Play)</button>
      <br />
      <br />
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
