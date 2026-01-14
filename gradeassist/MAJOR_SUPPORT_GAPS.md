# Major Support Gaps & Future Enhancements

**Last Updated:** January 13, 2026
**Current Coverage:** ~70-75% of university majors

---

## Current File Format Support

### ✅ Supported Formats
- **PDF** (.pdf) - Universal, best for all majors
- **Word Documents** (.docx, .doc) - Essays, reports, papers
- **Images** (.jpg, .png, .webp) - Screenshots, handwritten work photos

**Max File Size:** 50MB
**Max Pages:** 50 pages per document
**Max Batch:** 200 submissions

---

## Missing File Format Support

### HIGH PRIORITY - Business & Data Analysis

#### Spreadsheets
- **Formats Needed:** .xlsx, .xls, .csv, .ods
- **Impact:** +15% major coverage
- **Affected Majors:**
  - Accounting - Financial statements, ledgers, tax calculations
  - Finance - Financial models, portfolio analysis, valuations
  - Statistics - Data analysis, statistical calculations
  - Data Science - Data manipulation, analysis reports
  - Economics - Econometric models, data analysis
- **Technical Requirements:**
  - Excel file parsing (SheetJS/ExcelJS)
  - CSV parsing and validation
  - Convert to images for AI grading OR extract data for analysis
  - Support formula validation (optional)
  - Multi-sheet support

#### Presentations
- **Formats Needed:** .pptx, .ppt, .odp
- **Impact:** +5% major coverage
- **Affected Majors:**
  - Business Administration - Pitch decks, case presentations
  - Marketing - Campaign presentations, strategy decks
  - Communications - Public speaking assignments, media presentations
  - MBA Programs - Business proposals, consulting presentations
- **Technical Requirements:**
  - PowerPoint parsing (pptx.js or similar)
  - Convert slides to images (one per slide)
  - Support animations/transitions (convert to static images)
  - Extract speaker notes for analysis

---

### MEDIUM PRIORITY - Technical & Creative

#### Code Files
- **Formats Needed:** .py, .js, .java, .cpp, .c, .cs, .rb, .go, .ts, .jsx, .tsx
- **Impact:** +5% major coverage
- **Affected Majors:**
  - Computer Science - Programming assignments, algorithms
  - Software Engineering - Code submissions, projects
  - Web Development - HTML/CSS/JS assignments
  - Data Science - Python notebooks (alternative approach)
- **Technical Requirements:**
  - Support plain text code files
  - Syntax highlighting for display
  - Optional: Code execution & automated testing
  - Optional: Plagiarism detection
  - Convert to images with syntax highlighting for AI grading
- **Alternative Approaches:**
  - Accept code as text, run through text-based AI (Claude API)
  - Integrate with automated testing frameworks
  - Use specialized code grading tools (e.g., CodeGrade, Gradescope)

#### Jupyter Notebooks
- **Formats Needed:** .ipynb
- **Impact:** +3% major coverage
- **Affected Majors:**
  - Data Science - Analysis projects, machine learning assignments
  - Scientific Computing - Computational physics, biology
  - Research Methods - Data analysis, visualization
- **Technical Requirements:**
  - Parse .ipynb JSON structure
  - Extract code cells and markdown cells
  - Execute notebooks (optional)
  - Convert to images/HTML for grading

---

### LOW PRIORITY - Specialized Formats

#### Audio Files
- **Formats Needed:** .mp3, .wav, .m4a, .ogg, .flac
- **Impact:** +5% major coverage
- **Affected Majors:**
  - Music - Performance recordings, composition
  - Foreign Languages - Speaking assessments, pronunciation
  - Communications - Podcast assignments, radio projects
  - Linguistics - Phonetic analysis, speech patterns
- **Technical Requirements:**
  - Audio storage and streaming
  - Speech-to-text transcription (Whisper API)
  - Audio analysis (pitch, rhythm, tone)
  - Waveform visualization for grading UI
- **AI Capabilities:**
  - Gemini 2.0 Flash with audio input (experimental)
  - Whisper for transcription + text-based grading
  - Specialized music analysis APIs

#### Video Files
- **Formats Needed:** .mp4, .mov, .avi, .mkv, .webm
- **Impact:** +4% major coverage
- **Affected Majors:**
  - Film Studies - Video essays, editing projects
  - Theater/Drama - Performance recordings
  - Dance - Choreography recordings
  - Communications - Video journalism, broadcasting
  - Education - Teaching demonstrations
- **Technical Requirements:**
  - Video storage and streaming (high bandwidth)
  - Frame extraction for key moments
  - Transcript generation (speech-to-text)
  - Video player integration in grading UI
- **AI Capabilities:**
  - Gemini 2.0 Flash with video input (experimental)
  - Extract frames and analyze as images
  - Transcript-based analysis

#### Design Files (Vector/Raster)
- **Formats Needed:** .psd, .ai, .svg, .sketch, .xd, .fig
- **Impact:** +2% major coverage
- **Affected Majors:**
  - Graphic Design - Logo design, branding projects
  - Digital Media - Illustration, digital art
  - UI/UX Design - Interface mockups, prototypes
- **Technical Requirements:**
  - Convert vector files to rasterized images (PNG)
  - Preserve layers/artboards if possible
  - High-resolution rendering (300 DPI minimum)
- **Implementation:**
  - Use ImageMagick, Cairo, or cloud conversion APIs
  - Convert to PNG/JPG for AI visual analysis

#### CAD & 3D Files
- **Formats Needed:** .dwg, .dxf, .stl, .obj, .fbx, .blend
- **Impact:** +2% major coverage
- **Affected Majors:**
  - Architecture - Building designs, floor plans
  - Mechanical Engineering - CAD models, technical drawings
  - Civil Engineering - Structural designs
  - 3D Design - Modeling projects, animations
- **Technical Requirements:**
  - 3D file parsing and rendering
  - Generate 2D previews (orthographic views)
  - Dimension extraction and validation
- **Complexity:** Very high - may require specialized tools

---

## Majors by Support Level

### FULLY SUPPORTED (90%+ assignments work)

**Humanities & Social Sciences:**
- English Literature
- History
- Philosophy
- Psychology
- Sociology
- Political Science
- Anthropology
- Geography
- Classics
- Religious Studies

**STEM - Natural Sciences:**
- Mathematics
- Physics
- Chemistry
- Biology
- Environmental Science
- Earth Science
- Astronomy

**Professional Programs:**
- Law
- Medicine (written exams)
- Nursing (written work)
- Education
- Public Health
- Social Work

**Business (Written Focus):**
- Management (essays, case studies)
- Organizational Behavior
- Business Ethics
- International Business

---

### PARTIALLY SUPPORTED (50-70% assignments work)

**Technical STEM:**
- Computer Science ⚠️
  - ✓ Theory, algorithms on paper, pseudocode
  - ✗ Executable code, programming projects
- Engineering ⚠️
  - ✓ Calculations, hand-drawn diagrams, reports
  - ✗ CAD files, simulations, lab data files
- Statistics ⚠️
  - ✓ Written analysis, calculations on paper
  - ✗ Spreadsheet-based analysis, R/Python outputs

**Business (Quantitative):**
- Accounting ⚠️
  - ✓ Written problem sets in PDF/Word
  - ✗ Excel spreadsheets, financial statements
- Finance ⚠️
  - ✓ Calculations in documents, essays
  - ✗ Financial models, Excel-based valuations
- Economics ⚠️
  - ✓ Essays, written analysis, graphs in PDF
  - ✗ Econometric models, statistical software outputs

**Languages:**
- Foreign Languages ⚠️
  - ✓ Written essays, translations, grammar exercises
  - ✗ Speaking/listening assessments, oral exams

**Creative Fields:**
- Creative Writing ✓ (though creativity assessment is subjective)
- Art History ✓ (essays, visual analysis)
- Journalism ✓ (written articles)

---

### NOT SUPPORTED (<30% assignments work)

**Performance Arts:**
- Music ✗
  - ✓ Music theory (written)
  - ✗ Performance recordings, composition audio
- Theater/Drama ✗
  - ✓ Scripts, playbills (written)
  - ✗ Performance videos
- Dance ✗
  - ✓ Written choreography notes
  - ✗ Performance videos

**Design & Visual Arts:**
- Graphic Design ✗
  - ✓ Exported images (JPG/PNG)
  - ✗ Source files (PSD, AI, SVG)
- Architecture ✗
  - ✓ Rendered images, sketches
  - ✗ CAD files, BIM models
- 3D Design/Animation ✗
  - ✓ Rendered images
  - ✗ 3D model files, animation files
- Interior Design ✗
  - ✓ Rendered images, mood boards
  - ✗ Design software files

**Technical/Data-Heavy:**
- Data Science ✗
  - ✓ Written analysis, exported charts
  - ✗ Jupyter notebooks, CSV data files
- GIS/Cartography ✗
  - ✓ Exported map images
  - ✗ GIS project files (shapefiles, etc.)

---

## Recommended Course Type Expansions

### Current Course Types (9 total):
```
MATH
PHYSICS
CHEMISTRY
BIOLOGY
COMPUTER_SCIENCE
ENGINEERING
HUMANITIES
ESSAY
GENERAL
```

### Proposed Additional Course Types:

#### Tier 1 - High Impact
```
SOCIAL_SCIENCE    - Psychology, Sociology, Political Science, Anthropology
BUSINESS          - Management, Marketing, Strategy
ACCOUNTING        - Financial accounting, Managerial accounting
FINANCE           - Corporate finance, Investments, Financial analysis
ECONOMICS         - Micro, Macro, Econometrics
LANGUAGES         - Foreign language writing, Translation
LAW               - Legal writing, Case analysis, Memos
MEDICINE          - Medical exams, Clinical cases, Pathology
STATISTICS        - Statistical analysis, Probability
```

#### Tier 2 - Medium Impact
```
NURSING           - Care plans, Clinical reasoning
EDUCATION         - Lesson plans, Pedagogy
PUBLIC_HEALTH     - Epidemiology, Health policy
PHILOSOPHY        - Logic, Ethics, Epistemology
HISTORY           - Historical analysis, Document analysis
LITERATURE        - Literary analysis, Critical theory
CREATIVE_WRITING  - Fiction, Poetry, Screenwriting
JOURNALISM        - News writing, Reporting
COMMUNICATIONS    - Media studies, Public speaking (written)
```

#### Tier 3 - Specialized
```
ARCHITECTURE      - Design theory (if CAD support added)
ART_HISTORY       - Visual analysis, Art criticism
MUSIC_THEORY      - Written theory (if audio support added)
ENVIRONMENTAL_SCIENCE - Ecology, Sustainability
GEOGRAPHY         - Human/Physical geography
LINGUISTICS       - Language analysis, Syntax
RELIGIOUS_STUDIES - Theology, Comparative religion
```

**Benefit of Course Types:**
- Better AI prompt customization per discipline
- Subject-specific grading criteria
- Terminology awareness (e.g., legal terms, medical terminology)
- Methodology recognition (e.g., literary analysis vs. scientific method)

---

## Implementation Priority Roadmap

### Phase 1: Quick Wins (1-2 weeks)
1. ✅ **Expand Course Types** - Add SOCIAL_SCIENCE, BUSINESS, LAW, ECONOMICS, etc.
   - Low complexity, high impact on grading quality
   - Update Prisma schema enum
   - Update AI grading prompts with subject-specific instructions

2. **Add TXT/RTF Support** - Plain text files
   - Simple file reading
   - Supports code submissions (basic)
   - Minimal conversion needed

### Phase 2: High-Value Additions (3-4 weeks)
3. **Spreadsheet Support (.xlsx, .csv)**
   - Use SheetJS/ExcelJS for parsing
   - Convert sheets to images for AI grading
   - Extract data for validation (optional)
   - **Impact:** Accounting, Finance, Statistics majors (+15% coverage)

4. **Presentation Support (.pptx)**
   - Use pptx.js for parsing
   - Convert slides to images (one per slide)
   - Extract speaker notes
   - **Impact:** Business, Communications majors (+5% coverage)

### Phase 3: Technical Enhancements (6-8 weeks)
5. **Code File Support (.py, .js, .java, etc.)**
   - Accept plain text code files
   - Syntax highlighting for display
   - Optional: Integrate automated testing
   - Use text-based AI (Claude API) for code review
   - **Impact:** Computer Science majors (+5% coverage)

6. **Jupyter Notebook Support (.ipynb)**
   - Parse JSON structure
   - Extract and display code/markdown cells
   - Optional: Execute notebooks for validation
   - **Impact:** Data Science majors (+3% coverage)

### Phase 4: Multimedia (Future)
7. **Audio Support (.mp3, .wav)**
   - Integrate Whisper API for transcription
   - Audio player in grading UI
   - **Impact:** Music, Languages (+5% coverage)

8. **Video Support (.mp4, .mov)**
   - Video storage and streaming
   - Frame extraction for analysis
   - **Impact:** Film, Theater, Communications (+4% coverage)

### Phase 5: Specialized (Long-term)
9. **Design File Support (.psd, .ai, .svg)**
   - Convert to rasterized images
   - Layer preservation
   - **Impact:** Graphic Design (+2% coverage)

10. **CAD/3D File Support (.dwg, .stl, .obj)**
    - 3D rendering to 2D previews
    - Dimension extraction
    - **Impact:** Architecture, Engineering (+2% coverage)

---

## Technical Considerations

### Storage Requirements
- **Current:** ~2MB per submission (images)
- **With Spreadsheets:** +5-10MB per file
- **With Presentations:** +10-20MB per file
- **With Audio:** +5-50MB per file
- **With Video:** +50-500MB per file

**Recommendation:**
- Use Supabase storage with tiered retention
- Compress images after processing
- Consider cloud CDN for video streaming

### AI API Costs
- **Current:** Gemini Vision API (~$0.01 per submission)
- **With Audio:** Whisper API (~$0.006 per minute)
- **With Code:** Claude API (~$0.015 per submission)
- **With Video:** Gemini Video API (~$0.05 per minute)

**Recommendation:**
- Implement cost tracking per assignment
- Add usage limits for expensive formats
- Consider batch processing discounts

### Performance Impact
- **Spreadsheet Parsing:** +2-5 seconds per file
- **Presentation Conversion:** +3-7 seconds per file
- **Audio Transcription:** +0.5x file duration
- **Video Processing:** +2x file duration

**Recommendation:**
- Use background workers for all conversions
- Implement progress tracking
- Add queue priority system

---

## Database Schema Changes Needed

### For Spreadsheet Support
```sql
-- Add to Submission model
spreadsheetData Json?  -- Parsed spreadsheet data
sheetNames     String[] -- List of sheet names

-- Add to SubmissionPage model
sheetName      String?  -- Which sheet this page represents
cellRange      String?  -- Cell range for this section
```

### For Audio/Video Support
```sql
-- Add to Submission model
duration       Int?     -- Media duration in seconds
transcript     String?  -- Auto-generated transcript
transcriptUrl  String?  -- Link to full transcript file

-- New MediaFile model
model MediaFile {
  id            String   @id @default(cuid())
  submissionId  String
  mediaType     String   -- "audio" | "video"
  originalUrl   String   -- Original media file
  streamingUrl  String?  -- HLS/DASH streaming URL
  duration      Int      -- Duration in seconds
  transcriptUrl String?  -- Transcript file URL
  waveformUrl   String?  -- Audio waveform image
  createdAt     DateTime @default(now())

  submission Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)
}
```

### For Code Support
```sql
-- Add to Submission model
programmingLanguage String? -- "python", "javascript", etc.
testResults        Json?    -- Automated test results
syntaxErrors       String[] -- Compilation/syntax errors

-- New CodeExecution model
model CodeExecution {
  id           String   @id @default(cuid())
  submissionId String   @unique
  language     String   -- Programming language
  passed       Int      @default(0)
  failed       Int      @default(0)
  errors       String[] -- Runtime errors
  output       String?  -- Program output
  executedAt   DateTime @default(now())

  submission Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)
}
```

---

## Notes
- This document should be updated as new features are implemented
- Priority can shift based on user feedback and demand
- Some features (like video support) may require significant infrastructure investment
- Consider partnerships with specialized tools (e.g., CodeGrade for code grading)

---

**Contributors:** AI Implementation Team
**Review Schedule:** Quarterly or as needed
