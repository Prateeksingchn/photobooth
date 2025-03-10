export const generateFloatingElements = () => 
  Array.from({ length: 20 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

export const optimizedImages = [
  'https://i.pinimg.com/474x/d2/44/1d/d2441dcdc4c0fa8e17b0804228f21c97.jpg',
  'https://i.pinimg.com/474x/d7/b1/bd/d7b1bd86a753940f7a2ee28d3ed7e7c3.jpg',
  'https://i.pinimg.com/474x/ff/ed/d7/ffedd701013bf09fd0b7dddd2f0221b9.jpg',
  'https://i.pinimg.com/474x/7c/89/5c/7c895c79f21d2565d45a6c6163c032d7.jpg',
].map(src => ({
  src,
  placeholder: src.replace('.jpg', '-blur.jpg'),
})); 