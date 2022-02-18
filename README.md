# AudioWorkletProcessor-not-terminated-bug-demo
This demo was created to demonstrate that the AudioWorklet doesn't seemed to get terminated as expected even though the `process` method has returned `false` and all the audio nodes created have been disconnected.  

Clicking on the "Generate 4 seconds hiss sound" let you create a hiss sound that last 4 seconds using the `AudioWorklet` API. The `process` method of the `AudioWorkletProcessor` will return `false` after 4 seconds of sound generated, letting the system know that the processing is done and it can be terminated. Clicking on the "Clean Up" button will :  

1.  close the port on the AudioWorkletNode created to generate the hiss sound
2.  disconnect all the AudioNodes created during the demo to generate the hiss sound
3.  close the audio context created

After Clicking on the "Clean Up" button, if you open the Chrome memory profiler, you will that the AudioWorkletProcessor is still running. From my understanding, it should be cleaned up by the GC.

  

This demo was adapted from the [audio worklet demo](https://github.com/mdn/webaudio-examples/tree/master/audioworklet) from [Webaudio-examples](https://github.com/mdn/webaudio-examples)
