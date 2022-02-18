let audioContext = null;
let hissGainRange;
let oscGainRange;
let hissGenNode;
let gainNode;
let soundSource;
let hissGainParam;

async function createHissProcessor() {
  if (!audioContext) {
    try {
      audioContext = new AudioContext();
    } catch(e) {
      console.log("** Error: Unable to create audio context");
      return null;
    }
  }
  
  let processorNode;
  
  try {
    processorNode = new AudioWorkletNode(audioContext, "hiss-generator");
  } catch(e) {
    try {
      console.log("adding...")
      await audioContext.audioWorklet.addModule("hiss-generator.js");
      processorNode = new AudioWorkletNode(audioContext, "hiss-generator");
    } catch(e) {
      console.log(`** Error: Unable to create worklet node: ${e}`);
      return null;
    }
  }

  await audioContext.resume();
  return processorNode;
}

async function audioDemoStart() {
  hissGenNode = await createHissProcessor();
  if (!hissGenNode) {
    console.log("** Error: unable to create hiss processor");
    return;
  }
  soundSource = new OscillatorNode(audioContext);
  gainNode = audioContext.createGain();

  // Configure the oscillator node
  
  soundSource.type = "square";
  soundSource.frequency.setValueAtTime(440, audioContext.currentTime); // (A4)
  
  // Configure the gain for the oscillator
  
  gainNode.gain.setValueAtTime(oscGainRange.value, audioContext.currentTime);
  
  // Connect and start
  
  soundSource.connect(gainNode).connect(hissGenNode).connect(audioContext.destination);
  soundSource.start();
  
  // Get access to the worklet's gain parameter
  
  hissGainParam = hissGenNode.parameters.get("gain");
  hissGainParam.setValueAtTime(hissGainRange.value, audioContext.currentTime);
  
  hissGainRange.disabled = false;
  oscGainRange.disabled = false;
   document.getElementById("startDemo").disabled = true;
  document.getElementById("endDemo").disabled = false;
}

window.addEventListener("load", event => {
  //document.getElementById("toggle").addEventListener("click", toggleSound);
  document.getElementById("startDemo").addEventListener("click", audioDemoStart);
  document.getElementById("endDemo").addEventListener("click", audioDemoEnd);
  
  hissGainRange = document.getElementById("hiss-gain");
  oscGainRange = document.getElementById("osc-gain");
  
  hissGainRange.oninput = updateHissGain;
  oscGainRange.oninput = updateOscGain;
  
  hissGainRange.disabled = true;
  oscGainRange.disabled = true;
});

async function audioDemoEnd(event){

    hissGainRange.disabled = true;
    oscGainRange.disabled = true;
    
    hissGenNode.port.close();
    hissGenNode.disconnect();
    gainNode.disconnect();
    soundSource.disconnect();

    await audioContext.close();
    audioContext = null;  
     document.getElementById("startDemo").disabled = false;
  document.getElementById("endDemo").disabled = true;
}

/*async function toggleSound(event) {
  if (!audioContext) {
    audioDemoStart();
    
    hissGainRange.disabled = false;
    oscGainRange.disabled = false;
  } else {
    hissGainRange.disabled = true;
    oscGainRange.disabled = true;
    
    hissGenNode.port.close();
    hissGenNode.disconnect();
    gainNode.disconnect();
    soundSource.disconnect();

    await audioContext.close();
    audioContext = null;
  }
}*/

function updateHissGain(event) {
  hissGainParam.setValueAtTime(event.target.value, audioContext.currentTime);
}

function updateOscGain(event) {
  gainNode.gain.setValueAtTime(event.target.value, audioContext.currentTime);
}