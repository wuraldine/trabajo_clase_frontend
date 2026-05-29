const CATEGORY_LABELS_ES = {
  laptops: 'Portátiles',
  laptopses: 'Portátiles',
  smartphones: 'Teléfonos',
  audio: 'Audio',
  wearables: 'Dispositivos vestibles',
  gaming: 'Videojuegos',
  accessories: 'Accesorios',
  accesorios: 'Accesorios',
  tablets: 'Tabletas',
  monitors: 'Monitores',
  components: 'Componentes',
};

export function toSpanishCategoryLabel(category) {
  const raw = String(category ?? '').trim();
  if (!raw) return 'Sin categoría';
  const key = raw.toLowerCase();
  return CATEGORY_LABELS_ES[key] || raw;
}
