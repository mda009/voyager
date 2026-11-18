import sys
from fontTools.ttLib import TTFont, newTable
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
def convert(src,dst,max_err=1.0,reverse=True):
    font=TTFont(src);gs=font.getGlyphSet();glyf={}
    for name in font.getGlyphOrder():
        pen=TTGlyphPen(gs);gs[name].draw(Cu2QuPen(pen,max_err,reverse_direction=reverse));glyf[name]=pen.glyph()
    font['loca']=newTable('loca');font['glyf']=g=newTable('glyf');g.glyphOrder=font.getGlyphOrder();g.glyphs=glyf
    del font['CFF ']
    if 'VORG' in font: del font['VORG']
    font['maxp']=m=newTable('maxp');m.tableVersion=0x00010000
    for a in ('maxZones','maxTwilightPoints','maxStorage','maxFunctionDefs','maxInstructionDefs','maxStackElements','maxSizeOfInstructions','maxComponentElements'):setattr(m,a,0)
    m.maxZones=1
    font['head'].glyphDataFormat=0
    font['post'].formatType=2.0;font['post'].extraNames=[];font['post'].mapping={}
    font.sfntVersion='\x00\x01\x00\x00';font.recalcBBoxes=True
    font.save(dst)
for w in ['Regular','Medium','SemiBold','Bold','ExtraBold','Italic','SemiBoldItalic']:
    convert(f'/usr/share/fonts/opentype/inter/Inter-{w}.otf',f'Inter-{w}.ttf');print(w)
