const numOfElems = 33;
const array = [];

let audioCtx = null;
let currentAlgorithm = null; // Initially no algorithm selected

const playNote = (freq) => {
  if (audioCtx == null) {
    audioCtx = new (AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext)();
  }
  const dur = 0.1;
  const osc = audioCtx.createOscillator();
  osc.frequency.value = freq;
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  osc.connect(node);
  node.connect(audioCtx.destination);
};

const start = () => {
  for (let i = 0; i < numOfElems; i++) {
    array[i] = Math.random();
  }
  showBars();
};

const sort = () => {
  if (currentAlgorithm === null) {
    alert("Please select a sorting algorithm first!");
    return;
  }
  const copy = [...array];
  const moves = sortingAlgorithms[currentAlgorithm](copy); // Call the selected algorithm
  animate(moves);
};

const animate = (moves) => {
  if (moves.length == 0) {
    showBars();
    return;
  }
  const move = moves.shift();
  const [i, j] = move.indices;

  if (move.type === "swap") {
    [array[i], array[j]] = [array[j], array[i]];
  }

  playNote(200 + array[i] * 500);
  playNote(200 + array[i] * 500);

  showBars(move);
  setTimeout(function () {
    animate(moves);
  }, 250);
};

const bubbleSort = (array) => {
  const moves = [];
  let swapped;
  do {
    swapped = false;
    for (let i = 1; i < array.length; i++) {
      // Capture comparison move
      moves.push({
        indices: [i - 1, i],
        type: "comp",
      });

      if (array[i - 1] > array[i]) {
        swapped = true;
        moves.push({
          indices: [i - 1, i],
          type: "swap",
        });
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
      }
    }
  } while (swapped);
  return moves;
};

const quickSort = (array) => {
  const moves = [];
  const sort = (low, high) => {
    if (low < high) {
      const p = partition(low, high);
      sort(low, p - 1);
      sort(p + 1, high);
    }
  };

  const partition = (low, high) => {
    const pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      // Capture comparison move
      moves.push({
        indices: [j, high],
        type: "comp",
      });

      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        moves.push({ indices: [i, j], type: "swap" });
      }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    moves.push({ indices: [i + 1, high], type: "swap" });
    return i + 1;
  };

  sort(0, array.length - 1);
  return moves;
};

const insertionSort = (array) => {
  const moves = [];
  for (let i = 1; i < array.length; i++) {
    let current = array[i];
    let j = i - 1;

    // Capture comparison move
    moves.push({ indices: [j, i], type: "comp" });

    while (j >= 0 && array[j] > current) {
      array[j + 1] = array[j];
      j--;
      moves.push({ indices: [j + 1, j + 2], type: "swap" });
    }
    array[j + 1] = current;
  }
  return moves;
};

const selectionSort = (array) => {
  const moves = [];
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < array.length; j++) {
      moves.push({ indices: [minIndex, j], type: "comp" });

      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      moves.push({ indices: [i, minIndex], type: "swap" });
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
  }
  return moves;
};

// Mapping algorithms to functions
const sortingAlgorithms = {
  bubbleSort: bubbleSort,
  quickSort: quickSort,
  insertionSort: insertionSort,
  selectionSort: selectionSort,
};

// Set the selected algorithm
const setAlgorithm = (algorithm) => {
  currentAlgorithm = algorithm;
};

const showBars = (move) => {
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const element = document.createElement("div");
    element.style.height = array[i] * 100 + "%";
    element.classList.add("element");

    if (move && move.indices.includes(i)) {
      if (move.type === "swap") {
        element.style.backgroundColor = "red"; // Highlight swapped elements
      } else if (move.type === "comp") {
        element.style.backgroundColor = "blue"; // Highlight compared elements
      }
    }
    container.appendChild(element);
  }
};
