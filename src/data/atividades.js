// pasta dedicada a descrição e cadastro de atividades e sesus parâmetros, os dados serão puxados daqui

//cadastro de categorias de atividades
export const categorias = [
  { id: 'transporte', nome: 'Transporte', icone: 'car-outline' },
  { id: 'alimentacao', nome: 'Alimentação', icone: 'fast-food-outline' },
// preencher com mais categorias
];


//cadastro de atividades
export const atividades = [
  {
    id: 'ref-vegana',
    categoria: 'alimentacao',
    titulo: 'Refeição Vegana',
    pontos: 50,
    resumo: 'Reduz o consumo de água e a emissão de metano.',
    detalhes: 'Uma única refeição sem produtos de origem animal economiza cerca de 3.000 litros de água...',
    linkCientifico: 'https://exemplo.com/estudo-veganismo'
  },
  //veririfcar parametros e se é necessário criar mais campos
  // preencher com mais atividades
];
