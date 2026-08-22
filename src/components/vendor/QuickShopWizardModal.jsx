import React from 'react';
import AiStorefrontGeneratorModal from '../builder/AiStorefrontGeneratorModal';

/**
 * QuickShopWizardModal (Unifié avec le Moteur Unique IA Odoo)
 * Redirige de manière transparente vers AiStorefrontGeneratorModal pour garantir
 * qu'un seul et unique moteur de génération existe dans toute l'application.
 */
export default function QuickShopWizardModal({
  isOpen,
  onClose,
  shop = {},
  onComplete,
  onApplyGeneratedLayout
}) {
  if (!isOpen) return null;

  const handleApply = (generatedLayout) => {
    if (onApplyGeneratedLayout) {
      onApplyGeneratedLayout(generatedLayout);
    }
    if (onComplete) {
      onComplete({
        ...shop,
        layout_config: generatedLayout
      });
    }
  };

  return (
    <AiStorefrontGeneratorModal
      isOpen={isOpen}
      onClose={onClose}
      shop={shop}
      onApplyGeneratedLayout={handleApply}
    />
  );
}
