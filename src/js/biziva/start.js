import {mountAssistant} from './assistant.mjs';
import {creativeLayers,inspectCreative,parseCreative} from './creative.mjs';
export function startBiziva(app,config,doc){
  const host=doc.createElement('div');doc.body.append(host);
  return mountAssistant(host,{
    title:'Biziva Imagens',
    description:'Crie título, descrição e chamada como camadas de texto editáveis sobre sua arte. A IA escreve; a composição é feita localmente, sem gerar fotos pagas.',
    placeholder:'Crie uma oferta de ensaio fotográfico para uma campanha de Natal, sem inventar preços…',
    sourceUrl:'https://github.com/omatheuslop/biziva-imagens',
    instruction:'Retorne somente JSON {"headline":"Título","subtitle":"Descrição curta","cta":"Chamada","color":"#FFFFFF"}. Limites: headline 65 caracteres, subtitle 140, cta 35. Cor hexadecimal com seis dígitos. Escreva copy comercial clara em português. Não invente preços, descontos, garantias ou fatos da empresa. Não gere HTML.',
    parse:parseCreative,
    inspect:()=>inspectCreative(config),
    apply:async creative=>{
      const layers=creativeLayers(creative,config.WIDTH,config.HEIGHT);
      await app.State.do_action(new app.Actions.Bundle_action('biziva_creative','Criativo Biziva',layers.map(layer=>new app.Actions.Insert_layer_action(layer,false))));
      config.need_render=true;
    },
  });
}
