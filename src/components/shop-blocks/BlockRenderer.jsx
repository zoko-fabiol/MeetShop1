import React, { Component } from 'react';
import HeroBannerBlock from './HeroBannerBlock';
import FlashDealBlock from './FlashDealBlock';
import FeaturedProductsBlock from './FeaturedProductsBlock';
import CategoryCatalogBlock from './CategoryCatalogBlock';
import AboutStoryBlock from './AboutStoryBlock';
import OpeningHoursBlock from './OpeningHoursBlock';
import CustomerReviewsBlock from './CustomerReviewsBlock';
import ContactMapBlock from './ContactMapBlock';
import CustomFormBlock from './CustomFormBlock';
import CustomCtaBlock from './CustomCtaBlock';
import RichTextBlock from './RichTextBlock';
import FaqBlock from './FaqBlock';
import DynamicCodeBlock from './DynamicCodeBlock';
import InnerSnippetRenderer from './InnerSnippetRenderer';
import InnerSnippetSlotContainer from './InnerSnippetSlotContainer';
import { AlertCircle } from 'lucide-react';

class BlockErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erreur de rendu du bloc:', this.props.blockType, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 my-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Affichage temporairement indisponible pour le bloc <strong>{this.props.blockType || 'modulaire'}</strong></span>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function BlockRenderer({
  block,
  shop,
  themeId,
  products = [],
  onSelectProduct,
  onOpenWhatsApp,
  onNavigateToCatalog,
  isMobilePreview = false,
  isEditMode = false,
  selectedSnippetId = null,
  onSelectSnippet,
  onUpdateSnippet,
  onRemoveSnippet,
  onDuplicateSnippet,
    onMoveSnippet,
    onAddSnippet,
    onUpdateBlockProps
  }) {
    if (!block || block.visible === false || typeof block !== 'object') {
      return null;
    }

    const nestedSnippets = Array.isArray(block.props?.innerSnippets) ? block.props.innerSnippets : [];
    const isSnippetBlock = block.type === 'InnerSnippet' || block.type === 'Snippet' || block.type === 'SocialShare' || block.type === 'StatsBanner';

    const innerSnippetsSlot = !isSnippetBlock ? (
      <InnerSnippetSlotContainer
        snippets={nestedSnippets}
        blockId={block.id}
        shop={shop}
        themeId={themeId}
        isEditMode={isEditMode}
        selectedSnippetId={selectedSnippetId}
        onSelectSnippet={onSelectSnippet}
        onUpdateSnippet={onUpdateSnippet}
        onRemoveSnippet={onRemoveSnippet}
        onDuplicateSnippet={onDuplicateSnippet}
        onMoveSnippet={onMoveSnippet}
        onAddSnippet={onAddSnippet}
        onSelectProduct={onSelectProduct}
        onOpenWhatsApp={onOpenWhatsApp}
        onNavigateToCatalog={onNavigateToCatalog}
      />
    ) : null;

    const commonProps = {
      block: { ...block, props: block.props || {} },
      blockId: block.id,
      shop: shop || {},
      themeId: themeId || 'emerald',
      products: Array.isArray(products) ? products : [],
      onSelectProduct: onSelectProduct || (() => {}),
      onOpenWhatsApp: onOpenWhatsApp || (() => {}),
      onNavigateToCatalog: onNavigateToCatalog || (() => {}),
      isMobilePreview: Boolean(isMobilePreview),
      isEditMode: Boolean(isEditMode),
      onUpdateBlockProps: onUpdateBlockProps || (() => {}),
      innerSnippetsSlot
    };

  const renderContent = () => {
    switch (block.type) {
      case 'HeroBanner':
        return <HeroBannerBlock {...commonProps} />;
      case 'FlashDeal':
        return <FlashDealBlock {...commonProps} />;
      case 'FeaturedProducts':
        return <FeaturedProductsBlock {...commonProps} />;
      case 'CategoryCatalog':
        return <CategoryCatalogBlock {...commonProps} />;
      case 'AboutStory':
      case 'AboutStoryBlock':
        return <AboutStoryBlock {...commonProps} />;
      case 'OpeningHours':
      case 'OpeningHoursBlock':
        return <OpeningHoursBlock {...commonProps} />;
      case 'CustomerReviews':
      case 'CustomerReviewsBlock':
        return <CustomerReviewsBlock {...commonProps} />;
      case 'ContactMap':
      case 'ContactMapBlock':
        return <ContactMapBlock {...commonProps} />;
      case 'CustomForm':
      case 'CustomFormBlock':
        return <CustomFormBlock {...commonProps} />;
      case 'CustomCta':
      case 'CustomCtaBlock':
        return <CustomCtaBlock {...commonProps} />;
      case 'RichText':
      case 'RichTextBlock':
        return <RichTextBlock {...commonProps} />;
      case 'FaqBlock':
      case 'FaqAccordion':
      case 'Faq':
        return <FaqBlock {...commonProps} />;
      case 'CustomAiBlock':
      case 'DynamicCode':
      case 'DynamicCodeBlock':
        return <DynamicCodeBlock {...commonProps} />;
      case 'InnerSnippet':
      case 'Snippet':
      case 'SocialShare':
      case 'StatsBanner':
        return (
          <InnerSnippetRenderer
            snippetType={block.props?.snippetType || 'rating'}
            props={block.props || {}}
            shop={shop}
            themeId={themeId}
            designVariant={block.props?.designVariant || 'modern_minimal'}
            onSelectProduct={onSelectProduct}
            onOpenWhatsApp={onOpenWhatsApp}
            onNavigateToCatalog={onNavigateToCatalog}
          />
        );
      default:
        if (isEditMode) {
          return (
            <div className="p-4 my-2 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 text-center">
              <span>Bloc personnalisable : <strong>{block.type}</strong></span>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <BlockErrorBoundary blockType={block.type}>
      <div className="w-full">
        {renderContent()}
      </div>
    </BlockErrorBoundary>
  );
}
