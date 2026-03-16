import audifonosImg from '../assets/audifonos.jpg';
import laptopImg from '../assets/laptop.png';
import smartphoneImg from '../assets/smarphone.jpg';
import smartwatchImg from '../assets/Smartwatch.png';

export const products = [
  {
    id: 1,
    name: 'Laptop HP Pavilion',
    category: 'Laptops',
    price: 4500000,
    image: laptopImg,
    description:
      'Laptop HP Pavilion con procesador Intel Core i5, 8GB de RAM y 256GB de almacenamiento SSD.',
  },
  {
    id: 2,
    name: 'Smartphone Samsung Galaxy S21',
    category: 'Smartphones',
    price: 3500000,
    image: smartphoneImg,
    description:
      'Smartphone Samsung Galaxy S21 con pantalla AMOLED de 6.2 pulgadas, procesador Exynos 2100 y camara de 64MP.',
  },
  {
    id: 3,
    name: 'Audífonos Sony WH-1000XM4',
    category: 'Audio',
    price: 1200000,
    image: audifonosImg,
    description:
      'Audifonos Sony WH-1000XM4 con cancelacion de ruido, bateria de larga duracion y calidad de sonido premium.',
  },
  {
    id: 4,
    name: 'Smartwatch Apple Watch Series 6',
    category: 'Wearables',
    price: 2500000,
    image: smartwatchImg,
    description:
      'Smartwatch Apple Watch Series 6 con monitor de oxigeno en sangre, GPS y resistencia al agua.',
  },
];