import {parseJSON,cleanText} from './assistant.mjs';
export function parseCreative(text){
  const data=parseJSON(text);
  if(!/^#[a-f0-9]{6}$/i.test(data.color))throw Error('Use uma cor hexadecimal de seis dígitos.');
  return {headline:cleanText(data.headline,65),subtitle:cleanText(data.subtitle,140),cta:cleanText(data.cta,35),color:data.color};
}
export function inspectCreative(config){
  const issues=[];
  if(config.WIDTH<1080||config.HEIGHT<1080)issues.push(`Tela ${config.WIDTH} × ${config.HEIGHT}: considere ao menos 1080 pixels para publicações com alta resolução.`);
  for(const layer of config.layers){
    if(!layer.visible)continue;
    if(layer.opacity<70)issues.push(`${layer.name}: opacidade abaixo de 70%; revise a legibilidade.`);
    if(layer.x<0||layer.y<0||layer.x+layer.width>config.WIDTH||layer.y+layer.height>config.HEIGHT)issues.push(`${layer.name}: parte da camada está fora da tela.`);
  }
  return issues;
}
export function creativeLayers(creative,width,height){
  const scale=Math.min(width,height)/1080;
  const padding=54*scale;
  return [
    {text:creative.headline,size:64,y:height*.12,height:height*.25},
    {text:creative.subtitle,size:34,y:height*.44,height:height*.25},
    {text:creative.cta,size:40,y:height*.79,height:height*.14},
  ].map((part,index)=>({
    name:`Biziva ${['Título','Descrição','Chamada'][index]}`,type:'text',x:padding,y:part.y,
    width:width-padding*2,height:part.height,rotate:0,is_vector:true,color:creative.color,
    render_function:['text','render'],
    params:{boundary:'box',kerning:'metrics',text_direction:'ltr',wrap_direction:'ttb',halign:'left',valign:'top',wrap:'word'},
    data:[[{text:part.text,meta:{family:'Arial',size:Math.max(16,Math.round(part.size*scale)),bold:index!==1,fill_color:creative.color,stroke_color:'#ffffff00',stroke_size:0,leading:0}}]],
  }));
}
