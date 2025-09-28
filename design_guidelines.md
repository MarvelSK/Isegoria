# Isegoria Design Guidelines

## Design Approach
**System-Based Approach**: Utility-focused design prioritizing functionality, readability, and user safety for an anonymous chat platform. Clean, professional aesthetic with minimal visual distractions.

## Core Design Elements

### Color Palette
**Light Mode (Primary)**:
- Background: `#F9F9F9`
- Panels/Chat: `#FFFFFF`
- Text Primary: `#2C2C2C`
- Text Secondary/Hints: `#6C6C6C`
- Primary CTA: `#FF6B6B`
- Links/Hover: `#6EC1E4`
- Self Messages: `#1E4F8A` (white text)
- Other Messages: `#6EC1E4` (dark text)
- Success: `#4CAF50`
- Error: `#FF4C4C`

### Typography
- **Font Family**: Inter or Roboto
- **Headings**: Bold, 36px (desktop) / 28px (mobile)
- **Body Text**: Regular, 16px
- **Buttons**: Medium weight, 16px
- **Chat Messages**: Regular, 14-16px for optimal readability

### Layout System
**Tailwind Spacing**: Use units of 2, 4, 6, and 8 for consistent spacing (p-2, m-4, gap-6, h-8, etc.)
- Generous whitespace for clean, professional feel
- Consistent padding: p-4 for panels, p-6 for main containers
- Message spacing: gap-2 between messages, gap-4 between message groups

### Component Library

**Landing Page**:
- Hero section with centered content
- Clean typography hierarchy
- Prominent coral CTA button with rounded corners
- Minimal TOS link in footer

**Modal System**:
- Name entry popup: Centered modal with subtle shadow
- TOS modal: Full-width text content with comfortable reading margins
- Backdrop blur for focus

**Chat Interface**:
- Header bar with platform name (left) and active users counter (right)
- Chat message bubbles with rounded corners (12px radius)
- Self messages: Right-aligned, navy background
- Other messages: Left-aligned, sky blue background
- Image messages: Enhanced visual prominence with subtle borders and shadows

**Input System**:
- Chat input bar with rounded corners
- + icon for image upload (visually prominent)
- @ mention detection with user suggestions
- Reply threading with visual connection lines

**Anti-Spam Features**:
- Visual rate limiting indicators
- Message validation feedback
- Subtle loading states

### Visual Treatments
- **Rounded Corners**: 8px for buttons, 12px for chat bubbles, 16px for panels
- **Shadows**: Subtle drop shadows for depth (opacity 10-15%)
- **Image Prominence**: Images in chat have enhanced visibility with borders and slight elevation
- **Hover States**: Subtle color shifts maintaining accessibility

### Responsive Design
- Mobile-first approach
- Chat optimized for thumb navigation
- Collapsible elements on smaller screens
- Maintained readability across all devices

**No Hero Image**: Clean, text-focused landing page without large imagery to maintain professional, anonymous platform aesthetic.