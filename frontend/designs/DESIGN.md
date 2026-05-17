# CodeClash — Design Specifications

This section defines the visual, structural, and interaction design decisions that guide the development of the CodeClash Gaming platform. It serves as a blueprint to ensure consistency across components and teams, particularly in a modular development environment. The design specifications translate system requirements into concrete interface and user experience guidelines, reducing ambiguity during implementation.

## 1. Brand Style

The brand style defines the visual identity of CodeClash and ensures a consistent, professional appearance across all interfaces. 

### Colour Palette

The following colours form the primary palette. All colours were selected with WCAG AA contrast compliance in mind.

| Colour      | Hex Value | Role                                        |
|-------------|-----------|---------------------------------------------|
| Dark Navy   | `#0F172A` | Primary text, borders, headings             |
| Vivid Blue  | `#3B82F6` | Primary actions, ranked play, progress bars |
| Soft Purple | `#A78BFA` | Casual play, accent highlights, badges      |
| Slate Gray  | `#64748B` | Secondary text, nav items, labels           |
| Off-White   | `#F8FAFC` | Page backgrounds                            |
| White       | `#FFFFFF` | Card fills, input fields                    |
| Light Gray  | `#D9D9D9` | Radial card backgrounds                     |

### Typography

Two typefaces are used across the platform, each serving a distinct role.

| Typeface     | Role       | Weight          | Size Range | Usage                                |
|--------------|------------|-----------------|------------|--------------------------------------|
| Baloo Bhai 2 | Primary UI | 400 / 600 / 700 | 13–64 px   | Buttons, inputs, labels, body text   |
| Baskerville  | Display    | 400 / 700       | 24–64 px   | Page headings, nav items, play cards |

**Type scale:**

| Element                                    | Font         | Weight   | Size  | Colour    |
|--------------------------------------------|--------------|----------|-------|-----------|
| Page heading (Sign Up / Let's sign you in) | Baloo Bhai 2 | Bold     | 64 px | `#0F172A` |
| Section heading (Casual / Ranked Play)     | Baskerville  | Regular  | 40 px | `#0F172A` |
| Card title (Skill Progress)                | Baskerville  | Regular  | 28 px | `#0F172A` |
| Sub-heading (Welcome back!)                | Baloo Bhai 2 | Bold     | 32 px | `#64748B` |
| Body / input placeholder                   | Baloo Bhai 2 | Regular  | 24 px | `#0F172A` |
| Primary button text                        | Baloo Bhai 2 | SemiBold | 32 px | `#0F172A` |
| Social button text                         | Baloo Bhai 2 | SemiBold | 24 px | `#0F172A` |
| Navigation items                           | Baskerville  | Regular  | 24 px | `#64748B` |
| Stat value (#522, 5)                       | Baloo Bhai 2 | Bold     | 38 px | `#0F172A` |
| Stat label                                 | Baloo Bhai 2 | Regular  | 24 px | `#64748B` |
| Stat sub-label (Top 10%)                   | Baloo Bhai 2 | Regular  | 20 px | `#A78BFA` |
| Badge name (SPEED DEMON)                   | Baloo Bhai 2 | Regular  | 22 px | `#A78BFA` |
| Small labels / captions                    | Baloo Bhai 2 | Regular  | 13 px | `#0F172A` |

### Logo and Iconography

- The **CodeClash logo** is displayed at **124 × 124 px** in the top-left of the Dashboard header.
- The **shield motif** appears as a full-bleed watermark on the Sign In and Sign Up pages at **10% opacity**, centred behind the form container.
- **Stat icons** (trophy, flame) are rendered at **35 × 35 px** and **39 x 39 px** respectively with transparent backgrounds.
- **Badge images** are displayed at **222 × 222 px** within the Recently Earned card.
- **Social provider icons** (Google, Apple) are **28 × 28 px**, sourced as transparent PNG assets.
- All icon imports reside in `src/assets/` and are referenced via static imports.

### Design Principles

- **Consistency:** All interactive elements share a unified stroke colour (`#0F172A`, 1 px), border-radius (6–20 px scaled to component size), and typographic scale.
- **Simplicity:** Pages present a single primary action per screen. Secondary actions are visually subordinate.
- **Hierarchy:** Bold weight and large size signal primary content; muted colours and smaller sizes indicate secondary information.
- **Responsiveness:** The design targets a **1440 × 1024 px** desktop viewport. 
- **Accessibility:** Colour contrast ratios meet WCAG AA. Interactive elements have visible focus states and descriptive ARIA labels.

### UI Component Styling

All borders use `#0F172A` at the weight specified unless otherwise noted.

| Component                          | Size (px)     | Fill                                | Border | Notes                      |
|------------------------------------|---------------|-------------------------------------|--------|----------------------------|
| Primary button (Sign In / Sign Up) | 500 × 60      | `#3B82F6`                           | 2 px   | Font 32 px Baloo Bhai 2    |
| Social button (Google)             | 500 × 60      | `#A78BFA`                           | 1 px   | Font 24 px                 |
| Social button (Apple)              | 500 × 60      | `#3B82F6`                           | 1 px   | Font 24 px                 |
| Back button                        | 91 × 31       | `#FFFFFF`                           | 1 px   | Font 16 px                 |
| Input field                        | 500 × 60      | `#FFFFFF`                           | 1 px   | Placeholder at 60% opacity |
| Checkbox                           | 31 × 31       | `#FFFFFF`                           | 1 px   | Checked fill `#3B82F6`     |
| XP progress bar (track)            | 186 × 11      | `#FFFFFF`                           | 1 px   | —                          |
| XP progress bar (fill)             | variable × 11 | `#3B82F6`                           | 1 px   | —                          |
| Casual Play card                   | 601 × 324     | Linear gradient `#A78BFA` 70% → 30% | 1 px   | Border-radius 20 px        |
| Ranked Play card                   | 601 × 324     | Linear gradient `#3B82F6` 70% → 30% | 1 px   | Border-radius 20 px        |
| Play Now button                    | 490 × 63      | Solid card colour                   | 1 px   | Font 32 px                 |
| Stat card (rank / streak)          | 227 × 180     | Radial `#D9D9D9` → 30%              | 1 px   | Icon 39 × 39 px            |
| Skill progress card                | 763 × 377     | Radial `#D9D9D9` → 30%              | 1 px   | —                          |
| Skill progress bar (track)         | 100% × 26     | `#FFFFFF`                           | 1 px   | —                          |
| Skill progress bar (fill)          | variable × 26 | `#3B82F6` at 60%                    | —      | Level / 10                 |
| Recently Earned card               | 227 × 377     | Radial `#D9D9D9` → 30%              | 1 px   | Badge 222 × 222 px         |
| Profile circle                     | 36 × 36       | User image / `#A78BFA`              | 1 px   | Border-radius 50%          |

### Accessibility

- **Colour contrast:** all body text on white or off-white backgrounds meets WCAG AA (minimum 4.5:1).
- **Focus states:** all interactive elements receive a visible `box-shadow` outline on keyboard focus.
- **Semantic HTML:** headings use correct hierarchy (`h1 → h2 → h3`); buttons use `<button>`, not `<div>`.
- **ARIA labels:** icon-only buttons and decorative images carry `aria-hidden="true"` or descriptive `alt` text.
- **Form labels:** all inputs are associated with visible placeholder text and programmatic labels via `htmlFor`.

## 2. Wireframes

The wireframes provide a representations of each key screen. They illustrate component placement, navigation flow, and interaction points. Annotations explain behaviour and design intent.
**These wireframes can be found as a figma file in the same folder**

## Screen 1 — Welcome Page

The Welcome page is the first screen a user encounters upon launching the application. It serves as the entry point to the entire platform.

**Component Placement:**
- The CodeClash logo and mascot are centred horizontally, occupying the upper portion of the screen at 561 × 561 px. The mascot sits atop the shield icon with the "CODECLASH" wordmark beneath it.
- The heading "Welcome to CodeClash Gaming" is positioned centrally below the logo in Baloo Bhai 2 Bold, 64 px, `#0F172A`.
- The "Sign in" button (500 × 60 px, fill `#3B82F6`) is centred below the heading, serving as the dominant call to action.
- The "Are you a new user?" prompt and "Sign up" link are stacked below the button, in smaller text (24 px), with "Sign up" underlined to indicate it is a navigable link.

**Navigation Flow:**
- "Sign in" → navigates to the Sign In screen.
- "Sign up" → navigates to the Sign Up screen.

**User Interaction Points:**
- Single primary action (Sign In) reduces cognitive load for returning users.
- New user path is present but visually subordinate to avoid overwhelming first-time visitors.

## Screen 2 — Sign Up Page

The Sign Up page collects the information needed to create a new account.

**Component Placement:**
- The "← Back" button (91 × 31 px, white fill) is anchored to the top-left at all times, providing a consistent escape route.
- The "Sign Up" heading (64 px, Baloo Bhai 2 Bold) is centred at the top of the form area.
- The shield watermark is positioned absolutely behind the form at 10% opacity (`z-index: 0`), creating visual depth without interfering with form legibility.
- Four input fields (500 × 60 px each, white fill) are stacked vertically: First name, Last name, Email address, Password.
- The Terms & Conditions checkbox (31 × 31 px) and label sit below the password field, left-aligned to the form.
- The "Sign up" button (500 × 60 px, `#3B82F6`, 2 px border) is the primary action button, distinguished by a heavier border weight relative to other buttons.
- An "or" divider with two flanking lines (218 px each) separates the primary action from the social login options.
- "Sign up with Google" (`#A78BFA`) and "Sign up with Apple" (`#3B82F6`) buttons (500 × 60 px each) are stacked below the divider, each carrying their respective provider icon at 28 × 28 px.

**Navigation Flow:**
- "← Back" → navigates to the Welcome screen.

**User Interaction Points:**
- All four fields must be completed and the Terms & Conditions checkbox must be ticked before the form can be submitted (validation to be implemented in future iteration).
- Google and Apple sign-up buttons are OAuth entry points, reserved for a future backend integration. They are wired to placeholder callbacks (`onGoogleSignUp`, `onAppleSignUp`).

## Screen 3 — Sign In (Login) Page

The Sign In page allows existing users to authenticate and access their account.

**Component Placement:**
- "← Back" button (91 × 31 px) is anchored top-left, consistent with the Sign Up page.
- The heading "Let's sign you in" (64 px, Baloo Bhai 2 Bold) is centred, with the sub-heading "Welcome back!" (32 px, Baloo Bhai 2 Bold, `#64748B`) directly beneath it.
- The shield watermark follows the same pattern as the Sign Up page: absolutely positioned, 10% opacity, behind the form.
- Two input fields (500 × 60 px): Email address and Password, stacked vertically.
- The "Sign in" button (500 × 60 px, `#3B82F6`, 2 px border) is the primary action.
- The "or" divider and social buttons follow the same layout as the Sign Up screen.
- "Are you a new user?" and "Sign up" link are positioned at the bottom of the form, offering a redirect for users who arrived at this screen by mistake.

**Navigation Flow:**
- "← Back" → navigates to the Welcome screen.
- "Sign up" link → navigates to the Sign Up screen.
- Successful sign-in → navigates to the Dashboard.

**User Interaction Points:**
- The "Welcome back!" sub-heading provides positive reinforcement for returning users.
- The "Are you a new user?" prompt at the bottom ensures users who reach this screen by mistake can self-correct without using the Back button.

## Screen 4 — Dashboard

The Dashboard is the main hub of the application, giving users an overview of their account, available game modes, skill progress, and recent achievements.

**Component Placement:**

*Header:*
- The CodeClash logo (124 × 124 px) occupies the top-left of the header bar.
- The "CodeClash" wordmark (Baloo Bhai 2 Bold, 48 px) sits immediately to the right of the logo.
- The user info block occupies the top-right: a circular profile icon (36 × 36 px) sits to the left of the username and XP bar column. The XP bar (186 × 11 px) tracks experience progress. "Intermediate Player" is displayed below the bar in 13 px text.

*Navigation Bar:*
- A horizontal navigation bar sits below the header, separated by a 1 px border.
- Seven items: Dashboard, Friends, Leaderboard, Tournaments, Badges, Game Guide, Settings — all in Baskerville 24 px, `#64748B`.
- The active item (Dashboard) is indicated by underline styling and full `#0F172A` colour.

*Play Cards:*
- Two cards (601 × 324 px each) sit side by side below the nav bar, with equal horizontal margin on either side.
- Left card (Casual Play): purple linear gradient (`#A78BFA` 70% → 30%), with title, description, and a "Play Now >" button (490 × 63 px, solid `#A78BFA`).
- Right card (Ranked Play): blue linear gradient (`#3B82F6` 70% → 30%), with title, description, and a "Play Now >" button (490 × 63 px, solid `#3B82F6`).

*Bottom Row (left to right):*
- **Stat cards** (227 × 180 px each, stacked vertically): Current Rank (#522, trophy icon) and Win Streak (5, flame icon). Both use a radial gradient fill (`#D9D9D9` → 30%). Sub-labels ("Top 10%", "Personal best: 11") are displayed in `#A78BFA`.
- **Skill Progress card** (763 × 377 px): Displays three skill rows (Arrays & Strings, Integrals & Derivates, Recursion), each with an inline level badge and a horizontal progress bar filling proportionally to `level / 10`. An "All Skills >" button (matching the Back button style) sits in the top-right of the card.
- **Recently Earned card** (227 × 377 px): Displays the most recently earned badge image (222 × 222 px) with the badge name below in `#A78BFA`.

**Navigation Flow:**
- Profile circle → navigates to the Profile page.
- "Play Now >" (Casual or Ranked) → navigates to the Matchmaking / Queue screen.
- Nav bar items → navigate to their respective screens (Friends, Leaderboard, etc. — reserved for future implementation).

**User Interaction Points:**
- The profile circle is clickable and navigates to the Profile page.
- All bottom-row cards use a radial gradient background to visually distinguish them from the play cards above.
- The active nav item provides persistent orientation within the app.

## Screen 5 — Profile Page

The Profile page gives users a summary of their account information and statistics, and provides the logout action.

**Component Placement:**
- The "← Back" button (91 × 31 px, white fill, 1 px border `#0F172A`) is anchored to the top-left, consistent with all other secondary screens.
- The page content is centred within a single white card (500 px wide, `#FFFFFF` fill, 1 px border `#0F172A`, border-radius 20 px) that sits in the middle of the `#F8FAFC` page background.
- A circular avatar (96 × 96 px, `#A78BFA` fill or user-uploaded profile image) is centred at the top of the card.
- The username is displayed directly below the avatar in Baloo Bhai 2 Bold, 32 px, `#0F172A`.
- The user's email address sits below the username in 18 px, `#64748B`.
- The player level label ("Intermediate Player") is displayed below the email in 16 px, `#A78BFA`.
- A horizontal divider separates the identity block from the stats block.
- Two stat rows display Current Rank and Win Streak as label-value pairs, left-aligned labels in `#64748B` and right-aligned values in `#0F172A`.
- A second horizontal divider separates the stats from the logout action.
- The "Log Out" button (full card width × 60 px, `#3B82F6`, 2 px border) sits at the bottom of the card as the sole destructive action on the screen.

**Navigation Flow:**
- "← Back" → navigates to the Dashboard.
- "Log Out" → clears session state and navigates to the Welcome screen.

**User Interaction Points:**
- The profile circle on the Dashboard header is the entry point to this screen; clicking it navigates here directly.
- The Log Out button uses the same visual weight as the primary Sign In / Sign Up buttons (2 px border, blue fill) to signal it as the primary — and only — action on this page.
- Future iteration: the avatar circle will support a tap-to-upload interaction for custom profile photos.
- No form fields are present in this iteration; profile editing is reserved for a future settings screen.

## 3. Navigation Flow

