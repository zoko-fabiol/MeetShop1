import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Navigation, 
  ExternalLink, 
  Compass, 
  Share2, 
  Check, 
  Layers, 
  Map as MapIcon,
  Car,
  Maximize2,
  Globe
} from 'lucide-react';
import { getTheme } from '../../config/themes';
import { getButtonClasses } from '../../config/blockStyles';
import { getDesignVariant } from '../../config/blockDesignStyles';
import { getCustomColorStyle } from '../../config/colorTokens';
import SlotReplacer from './SlotReplacer';

// Coordonnées GPS réelles des quartiers principaux du Cameroun (Douala & Yaoundé)
const QUARTER_COORDINATES = {
  // Douala
  'Akwa': { lat: 4.0505, lon: 9.7042, city: 'Douala' },
  'Bonanjo': { lat: 4.0435, lon: 9.6915, city: 'Douala' },
  'Bonapriso': { lat: 4.0298, lon: 9.6987, city: 'Douala' },
  'Bali': { lat: 4.0380, lon: 9.6950, city: 'Douala' },
  'Deido': { lat: 4.0620, lon: 9.7180, city: 'Douala' },
  'Bepanda': { lat: 4.0720, lon: 9.7320, city: 'Douala' },
  'Makepe': { lat: 4.0840, lon: 9.7480, city: 'Douala' },
  'Logpom': { lat: 4.0910, lon: 9.7750, city: 'Douala' },
  'Kotto': { lat: 4.0870, lon: 9.7560, city: 'Douala' },
  'Bonamoussadi': { lat: 4.0810, lon: 9.7390, city: 'Douala' },
  'Ndogpassi': { lat: 4.0150, lon: 9.7620, city: 'Douala' },
  'Yassa': { lat: 3.9980, lon: 9.7950, city: 'Douala' },
  
  // Yaoundé
  'Bastos': { lat: 3.8850, lon: 11.5150, city: 'Yaoundé' },
  'Centre-ville': { lat: 3.8667, lon: 11.5167, city: 'Yaoundé' },
  'Omnisports': { lat: 3.8880, lon: 11.5390, city: 'Yaoundé' },
  'Biyem-Assi': { lat: 3.8370, lon: 11.4880, city: 'Yaoundé' },
  'Mendong': { lat: 3.8290, lon: 11.4790, city: 'Yaoundé' },
  'Nlongkak': { lat: 3.8790, lon: 11.5230, city: 'Yaoundé' },
  'Mvan': { lat: 3.8180, lon: 11.5190, city: 'Yaoundé' },
  'Etoa-Meki': { lat: 3.8750, lon: 11.5310, city: 'Yaoundé' },
  'Essos': { lat: 3.8710, lon: 11.5420, city: 'Yaoundé' },
  'Ngousso': { lat: 3.8960, lon: 11.5540, city: 'Yaoundé' }
};

export default function ContactMapBlock({ 
  block, 
  blockId,
  shop, 
  themeId, 
  onOpenWhatsApp, 
  isMobilePreview = false,
  isEditMode = false,
  onUpdateBlockProps,
  onSelectProduct
}) {
  const theme = getTheme(themeId);
  const props = block?.props || {};
  const currentBlockId = blockId || block?.id;
  const dv = getDesignVariant(props.designVariant || 'modern_minimal');

  const titleStyle = getCustomColorStyle(props.titleColor);
  const textStyle = getCustomColorStyle(props.textColor);

  const title = props.title || 'Localisation & Contact Direct';
  const quarterName = shop?.quarter || props.quarter || 'Akwa';
  const cityName = shop?.city || props.city || 'Douala';
  const landmark = props.landmark || `Situé à ${quarterName}, ${cityName}`;
  const phone = props.directPhone || shop?.phone || '+237699123456';
  const buttonStyle = props.buttonStyle || 'modern_rounded';
  const primaryButtonClass = getButtonClasses(buttonStyle, theme, 'primary');

  const [copied, setCopied] = useState(false);
  const [mapMode, setMapMode] = useState(() => props.defaultView || 'satellite');

  const coordData = QUARTER_COORDINATES[quarterName] || 
    (cityName === 'Yaoundé' ? { lat: 3.8667, lon: 11.5167 } : { lat: 4.0505, lon: 9.7042 });

  const lat = props.latitude ? parseFloat(props.latitude) : coordData.lat;
  const lon = props.longitude ? parseFloat(props.longitude) : coordData.lon;

  const satelliteEmbedUrl = `https://maps.google.com/maps?q=${lat},${lon}&t=h&z=17&ie=UTF8&iwloc=&output=embed`;
  const planEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.008}%2C${lat - 0.006}%2C${lon + 0.008}%2C${lat + 0.006}&layer=mapnik&marker=${lat}%2C${lon}`;
  const currentEmbedUrl = mapMode === 'satellite' ? satelliteEmbedUrl : planEmbedUrl;

  const replacerProps = {
    blockId: currentBlockId,
    blockType: 'ContactMap',
    blockProps: props,
    isEditMode,
    onUpdateBlockProps,
    themeId,
    shop,
    onSelectProduct: isEditMode ? undefined : onSelectProduct,
    onOpenWhatsApp: isEditMode ? undefined : onOpenWhatsApp
  };

  return (
    <section className={`p-4 sm:p-8 mb-6 sm:mb-8 overflow-hidden transition-all duration-300 ${dv.containerClass}`}>
      <div className={`flex items-start justify-between gap-5 sm:gap-6 ${isMobilePreview ? 'flex-col' : 'flex-col lg:flex-row'}`}>
        
        {/* Colonne Gauche : Coordonnées & Actions de Contact */}
        <div className="w-full lg:w-5/12 space-y-4">
          
          <SlotReplacer slotName="headerSlot" slotLabel="En-tête Localisation" {...replacerProps}>
            <div>
              <div className="flex items-center gap-2">
                <span className={`p-2 rounded-xl ${dv.accentBadgeClass || theme.badge} shrink-0`}>
                  <MapPin className="w-5 h-5" />
                </span>
                <div>
                  <h2 style={titleStyle} className={`text-lg sm:text-2xl font-black tracking-tight ${dv.headerClass}`}>
                    {title}
                  </h2>
                  <p style={textStyle} className={`text-xs font-medium ${dv.subTextClass}`}>
                    {shop.name} • Boutique Physique
                  </p>
                </div>
              </div>
            </div>
          </SlotReplacer>

          <SlotReplacer slotName="infoSlot" slotLabel="Adresse & Repères" {...replacerProps}>
            <div className={`space-y-2.5 ${dv.cardInnerClass || 'p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800'}`}>
              <div className="flex items-start gap-2.5">
                <Compass className={`w-4 h-4 mt-0.5 shrink-0 ${theme.accentColor}`} />
                <div>
                  <h4 className="text-xs font-black text-current">Adresse & Repères</h4>
                  <p className="text-xs opacity-80 leading-relaxed text-current">
                    {landmark}, {cityName} (Cameroun)
                  </p>
                </div>
              </div>
            </div>
          </SlotReplacer>

          <SlotReplacer slotName="actionSlot" slotLabel="Boutons de Contact" {...replacerProps}>
            <div className="pt-1 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={(e) => {
                  if (isEditMode) {
                    e.preventDefault();
                    return;
                  }
                  onOpenWhatsApp?.(phone, shop.name);
                }}
                className={`w-full sm:flex-1 py-3 text-xs flex items-center justify-center gap-2 ${dv.buttonClass || primaryButtonClass}`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Direct</span>
              </button>

              <a
                href={isEditMode ? undefined : `tel:${phone}`}
                onClick={(e) => {
                  if (isEditMode) e.preventDefault();
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-current border border-current/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Appeler</span>
              </a>
            </div>
          </SlotReplacer>
        </div>

        {/* Colonne Droite : Vue Satellite / Plan GPS Interactive */}
        <div className="w-full lg:w-7/12">
          <SlotReplacer slotName="mapViewSlot" slotLabel="Carte GPS & Itinéraire" {...replacerProps}>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-inner h-64 sm:h-80">
              <iframe
                title="Carte localisation boutique"
                src={currentEmbedUrl}
                className="w-full h-full border-0 filter saturate-125"
                loading="lazy"
              />
            </div>
          </SlotReplacer>
        </div>

      </div>
    </section>
  );
}
