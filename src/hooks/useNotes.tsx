import * as Note from "@tonaljs/note";

export function useNotes() {
  const chromatics = Note.sortedUniqNames([
    ...Note.names(),
    ...[0, 1, 2, 3, 4, 5, 6].map((n) =>
      Note.simplify(Note.transposeFifths("F#", n)),
    ),
  ]);

  const getRandomChromatic = () =>
    chromatics[Math.floor(Math.random() * chromatics.length)];

  const getNoteFromAudio = (analyser: AnalyserNode): string => {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const strongestValue = Math.max(...dataArray);

    const sampleRate = analyser.context.sampleRate;
    const frequencyPerBin = sampleRate / (analyser.frequencyBinCount * 2);
    const freq = dataArray.indexOf(strongestValue) * frequencyPerBin;

    return Note.fromFreq(freq);
  };

  return {
    getRandomChromatic,
    getNoteFromAudio,
  };
}
