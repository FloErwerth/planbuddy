# i18next Translation Setup for PlanBuddy

## Overview

This document describes the i18next internationalization setup that has been implemented for the PlanBuddy application.

## What Has Been Set Up

### 1. Packages Installed
- `i18next` - Core internationalization framework
- `react-i18next` - React bindings for i18next

### 2. Files Created

#### Translation Files
- `locales/de.json` - German translations (default language)
- `locales/en.json` - English translations

#### Configuration Files
- `i18n/config.ts` - i18next configuration
- `i18n/index.ts` - Main i18n export
- `hooks/useTranslation.ts` - Custom hook for easy translation access

### 3. Configuration
The i18n system is initialized in `app/_layout.tsx` and configured to:
- Use German (de) as the default language
- Fall back to German if a translation is missing
- Support interpolation for dynamic values (e.g., `{{name}}`, `{{email}}`)

## Translation Structure

The translations are organized hierarchically in JSON files:

```json
{
  "welcome": {
    "title": "Willkommen bei PlanBuddy",
    "subtitle": "Erstelle mühelos Events mit deinen Freunden"
  },
  "auth": {
    "login": {
      "title": "...",
      "button": "..."
    }
  }
}
```

## How to Use Translations in Components

### Basic Usage

```typescript
import { useTranslation } from '@/hooks/useTranslation';

export const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <Text>{t('welcome.title')}</Text>
  );
};
```

### With Interpolation

```typescript
// Translation: "Wir haben dir einen Code an {{email}} gesendet"
<Text>{t('auth.token.description', { email: userEmail })}</Text>
```

### With Pluralization

```typescript
// Translation: "{{count}} Gäste"
<Text>{t('guests.count', { count: guestCount })}</Text>
```

## Files Already Updated

The following files have been updated to use translations:

### Authentication Screens
- ✅ `app/index.tsx` - Welcome screen
- ✅ `screens/Authentication/LoginForm.tsx` - Login form
- ✅ `screens/Authentication/TokenScreen.tsx` - Token verification
- ✅ `screens/Authentication/SendingEmailScreen.tsx` - Email sending status
- ✅ `screens/Authentication/OnboardingScreen.tsx` - User onboarding

### Event Screens
- ✅ `screens/Events/Events.tsx` - Events list
- ✅ `screens/EventCreation/EventCreation.tsx` - Event creation/editing

### Components
- ✅ `components/Calendar/Calendar.tsx` - Calendar component with month/day names

## Files That Still Need Translation

The following files contain German text and need to be updated:

### Event Details
- ⏳ `app/eventDetails/hosts.tsx` - "Dein Host"
- ⏳ `app/eventDetails/transferEvent.tsx` - Transfer event dialog
- ⏳ `screens/EventDetails/EventDetails.tsx` - Event details view

### Participants & Guests
- ⏳ `screens/Participants/Participants.tsx` - Participants list
- ⏳ `screens/Participants/ParticipantEditSheet/Guest/EditGuestOptions.tsx`
- ⏳ `screens/Participants/ParticipantEditSheet/Me/GuestContent.tsx`
- ⏳ `screens/Participants/ParticipantEditSheet/Me/CreatorContent.tsx`
- ⏳ `screens/Participants/ParticipantEditSheet/ParticipantEditScreen.tsx`
- ⏳ `screens/EventDetails/InviteFriends/EventDetailsConfirmInvitations/EventDetailsConfirmInvitations.tsx`
- ⏳ `screens/EventDetails/InviteFriends/EventDetailsInviteGuests/EventDetailsInviteGuests.tsx`

### Profile & Friends
- ⏳ `screens/ProfileScreen/ProfileScreen.tsx`
- ⏳ `screens/ProfileScreen/EditProfileScreen.tsx`
- ⏳ `screens/ProfileScreen/ProfileStatistics/ProfileStatistics.tsx`
- ⏳ `screens/ProfileScreen/DeleteUserDialog.tsx`
- ⏳ `screens/ProfileScreen/Notifications/NotificationsScreen.tsx`
- ⏳ `screens/ProfileScreen/FriendRequests/FriendRequestsScreen.tsx`
- ⏳ `screens/FriendsScreen/FriendsScreen.tsx`
- ⏳ `screens/AddFriendsScreen/AddFriendsScreen.tsx`
- ⏳ `screens/AddFriendsScreen/FriendEntry.tsx`

### Sheets & Dialogs
- ⏳ `sheets/ManageFriendSheet.tsx`
- ⏳ `sheets/ShareSheet.tsx`
- ⏳ `screens/ShareEvent/ShareEvent.tsx`

## Step-by-Step Migration Guide

For each file that needs translation:

### 1. Import the hook
```typescript
import { useTranslation } from '@/hooks/useTranslation';
```

### 2. Use the hook in your component
```typescript
export const MyComponent = () => {
  const { t } = useTranslation();
  // ... rest of component
```

### 3. Replace hardcoded strings
```typescript
// Before:
<Text>Willkommen bei PlanBuddy</Text>

// After:
<Text>{t('welcome.title')}</Text>
```

### 4. Add new translations if needed
If you find text that isn't in the translation files yet, add it to both `locales/de.json` and `locales/en.json`:

```json
// locales/de.json
{
  "myNewSection": {
    "myText": "Mein neuer deutscher Text"
  }
}

// locales/en.json
{
  "myNewSection": {
    "myText": "My new English text"
  }
}
```

## Available Translation Keys

Here are the main translation key prefixes available:

- `welcome.*` - Welcome screen
- `auth.login.*` - Login screen
- `auth.token.*` - Token verification
- `auth.sendingEmail.*` - Email sending
- `auth.onboarding.*` - Onboarding
- `events.*` - Events (list, create, edit, etc.)
- `guests.*` - Guest management
- `participants.*` - Participants
- `friends.*` - Friends and friend requests
- `profile.*` - User profile
- `notifications.*` - Notifications settings
- `share.*` - Sharing events
- `actions.*` - Common actions (cancel, save, etc.)
- `creator.*` - Event creator specific
- `calendar.*` - Calendar localization

## Testing Translations

To test your translations:

1. Run the app in development mode
2. All text should appear in German by default
3. To test English, you would need to add language switching functionality (see below)

## Adding Language Switching (Future Enhancement)

To allow users to switch languages, you can:

1. Install `expo-localization` for device language detection:
```bash
bun add expo-localization
```

2. Update `i18n/config.ts`:
```typescript
import * as Localization from 'expo-localization';

const getDeviceLanguage = (): string => {
  const locale = Localization.locale;
  return locale.startsWith('de') ? 'de' : 'en';
};
```

3. Add a language picker in settings:
```typescript
import i18n from '@/i18n';

const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
};
```

## Common Patterns

### With Variables
```typescript
t('auth.token.description', { email: 'user@example.com' })
// Result: "Wir haben dir einen 6-stelligen Code an user@example.com gesendet"
```

### With Count
```typescript
t('guests.reviewAndAdd', { count: 5 })
// Result: "Gäste überprüfen und hinzufügen(5)"
```

### Conditional Text
```typescript
{isEditing ? t('events.update') : t('events.create')}
```

## Best Practices

1. **Organize keys logically**: Group related translations together
2. **Use descriptive keys**: `auth.login.button` not `btn1`
3. **Keep translations DRY**: Reuse common translations like `actions.cancel`
4. **Add context**: If the same word has different meanings, use different keys
5. **Test both languages**: Ensure both German and English translations make sense
6. **Handle plurals**: Use i18next pluralization for count-dependent text

## Troubleshooting

### Translation not showing
- Check that the key exists in the translation file
- Verify the key path is correct (case-sensitive)
- Check for typos in the translation key

### Wrong language showing
- Check `i18n/config.ts` for the default language setting
- Verify `LocaleConfig.defaultLocale` matches the desired language

### App crashes after adding translation
- Verify JSON syntax in translation files (no trailing commas)
- Check that both language files have the same structure
- Look for missing closing braces in JSON

## Next Steps

1. Continue migrating remaining files listed in "Files That Still Need Translation"
2. Test all screens to ensure translations work correctly
3. Consider adding language switching functionality
4. Add translations for any error messages or validation text
5. Consider adding more languages if needed (e.g., French, Spanish)

## Support

For more information on i18next:
- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)


