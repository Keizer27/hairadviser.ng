// Initialize GPT4All (WebAssembly)
const gpt4all = new GPT4All({
  model: 'ggml-gpt4all-j-v1.3-groovy.bin',
  wasmPath: './' // Model files in same directory
});

// TensorFlow.js Analyzer
async function analyzeImage(img) {
  const faceModel = await blazeface.load();
  const faces = await faceModel.estimateFaces(img);
  
  return {
    faceShape: classifyFaceShape(faces), // Your custom function
    hairType: classifyHairType(img), // Your custom function
    location: "Nigeria"
  };
}

// Generate Advice
async function getHairAdvice(data) {
  await gpt4all.load(); // Load GPT4All (~2GB model)
  
  const prompt = `
    As a Nigerian hair expert, recommend:
    1. 3 hairstyles for ${data.faceShape} face and ${data.hairType} hair
    2. Weekly care routine for ${data.location} climate
    3. DIY natural products
    Reply in Nigerian Pidgin with emojis.
  `;
  
  return await gpt4all.generate(prompt, {
    maxTokens: 500,
    temperature: 0.7
  });
}

// Handle Image Upload
document.getElementById('hairPhoto').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  document.getElementById('loading').style.display = 'flex';
  
  const img = document.createElement('img');
  img.src = URL.createObjectURL(file);
  img.onload = async () => {
    const analysis = await analyzeImage(img);
    const advice = await getHairAdvice(analysis);
    
    // Store and redirect
    sessionStorage.setItem('hairAdvice', advice);
    window.location.href = 'results.html';
  };
});
