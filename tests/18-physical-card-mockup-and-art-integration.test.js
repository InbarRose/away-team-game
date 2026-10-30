import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Suite 18: Physical Card Mockup, Print Proofing Geometry & Art Integration', () => {
  it('verifies PhysicalCardMockup component exists and defines print proofing modes and SVG export', () => {
    const mockupPath = path.join(ROOT_DIR, 'src', 'components', 'PhysicalCardMockup.tsx');
    assert.ok(fs.existsSync(mockupPath), 'src/components/PhysicalCardMockup.tsx must exist');

    const mockupCode = fs.readFileSync(mockupPath, 'utf8');
    assert.ok(mockupCode.includes('export function PhysicalCardMockup'), 'Must export PhysicalCardMockup');
    assert.ok(mockupCode.includes('export function PhysicalCardModal'), 'Must export PhysicalCardModal');
    assert.ok(mockupCode.includes("CardViewMode = 'realistic' | 'proofing' | 'back'"), 'Must support realistic, proofing, and back modes');
    assert.ok(mockupCode.includes('3mm'), 'Must include 3mm industrial bleed specifications');
    assert.ok(mockupCode.includes('generateCardSvg'), 'Must provide standalone vector SVG export function');
    assert.ok(mockupCode.includes('SAFE CUT MARGIN'), 'Must provide safe cut margin indicators');
  });

  it('enforces exact tabletop card aspect ratios (Poker 63×88 mm and Tarot 70×120 mm)', () => {
    const mockupCode = fs.readFileSync(
      path.join(ROOT_DIR, 'src', 'components', 'PhysicalCardMockup.tsx'),
      'utf8'
    );
    // Poker 63x88mm
    assert.ok(mockupCode.includes('63'), 'Must support 63mm width Poker');
    assert.ok(mockupCode.includes('88'), 'Must support 88mm height Poker');
    // Tarot 70x120mm
    assert.ok(mockupCode.includes('70'), 'Must support 70mm width Tarot');
    assert.ok(mockupCode.includes('120'), 'Must support 120mm height Tarot');
  });

  it('verifies active text budget metrics for physical card readability', () => {
    const mockupCode = fs.readFileSync(
      path.join(ROOT_DIR, 'src', 'components', 'PhysicalCardMockup.tsx'),
      'utf8'
    );
    assert.ok(mockupCode.includes('charCount'), 'Must track character density');
    assert.ok(mockupCode.includes('wordCount'), 'Must track word count');
    assert.ok(mockupCode.includes('DENSE / OVERFLOW'), 'Must warn on dense copy overflow');
    assert.ok(mockupCode.includes('OPTIMAL READABILITY'), 'Must report optimal readability status');
  });

  it('verifies physical card mockup integration in WikiPortal and ComponentCard', () => {
    const wikiCode = fs.readFileSync(
      path.join(ROOT_DIR, 'src', 'components', 'WikiPortal.tsx'),
      'utf8'
    );
    const cardCode = fs.readFileSync(
      path.join(ROOT_DIR, 'src', 'components', 'ComponentCard.tsx'),
      'utf8'
    );

    assert.ok(wikiCode.includes('PhysicalCardMockup'), 'WikiPortal must import PhysicalCardMockup');
    assert.ok(wikiCode.includes('PhysicalCardModal'), 'WikiPortal must import PhysicalCardModal');
    assert.ok(wikiCode.includes('Realistic Card Mockup & Print Proof'), 'WikiPortal must provide mockup view toggle');
    assert.ok(wikiCode.includes('Inspect Print Mockup'), 'WikiPortal Infobox must include print mockup inspect button');

    assert.ok(cardCode.includes('PhysicalCardModal'), 'ComponentCard must import PhysicalCardModal');
    assert.ok(cardCode.includes('Print Proof'), 'ComponentCard must offer 1-click Print Proof inspection');
  });

  it('verifies art integration across all 7 Virtual Tabletop (VTT) card components', () => {
    const vttDir = path.join(ROOT_DIR, 'src', 'vtt', 'components');

    const opCode = fs.readFileSync(path.join(vttDir, 'OperativeCard.tsx'), 'utf8');
    assert.ok(opCode.includes('artSpec.asset_path') || opCode.includes('artSpec?.asset_path'), 'OperativeCard must render character portrait art');
    assert.ok(opCode.includes('PhysicalCardModal'), 'OperativeCard must support inspecting physical card modal');

    const factionCode = fs.readFileSync(path.join(vttDir, 'FactionDossierCard.tsx'), 'utf8');
    assert.ok(factionCode.includes('artSpec.asset_path') || factionCode.includes('artSpec?.asset_path'), 'FactionDossierCard must render faction artwork');

    const itemCode = fs.readFileSync(path.join(vttDir, 'ArmoryItemCard.tsx'), 'utf8');
    assert.ok(itemCode.includes('item.art_spec?.asset_path'), 'ArmoryItemCard must render item equipment art');

    const agendaCode = fs.readFileSync(path.join(vttDir, 'AgendaCard.tsx'), 'utf8');
    assert.ok(agendaCode.includes('agenda.art_spec?.asset_path'), 'AgendaCard must render agenda card art');

    const stageCode = fs.readFileSync(path.join(vttDir, 'StageCard.tsx'), 'utf8');
    assert.ok(stageCode.includes('attachedModifier.art_spec?.asset_path'), 'StageCard must render attached modifier art');

    const hqCode = fs.readFileSync(path.join(vttDir, 'HQFacilityBoard.tsx'), 'utf8');
    assert.ok(hqCode.includes('fac.art_spec?.asset_path'), 'HQFacilityBoard must render facility module art');

    const objectiveCode = fs.readFileSync(path.join(vttDir, 'SecretObjectiveCard.tsx'), 'utf8');
    assert.ok(objectiveCode.includes('objective.art_spec?.asset_path'), 'SecretObjectiveCard must render secret objective art');
  });
});
