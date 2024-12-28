# Migration Guide

## Migrating to v0.4.0

### Type System Changes

In version 0.4.0, we've made significant improvements to our type system to ensure better type safety and consistency. Here are the key changes:

#### 1. Consolidated Type Definitions

All Nostr-related types are now defined in a single location and exported from the package root. This ensures consistency and prevents type conflicts.

```typescript
// ✅ New way - import from package root
import { NostrEvent, NostrEventKind } from 'nostr-crypto-utils';

// ❌ Deprecated - don't import from subdirectories
import { NostrEvent } from 'nostr-crypto-utils/dist/types/base';
```

#### 2. Enhanced NostrEventKind Enum

The `NostrEventKind` enum has been updated to include all standard NIP event kinds with proper documentation:
- Added missing NIP-28 event kinds
- Added NIP-42 authentication event kinds
- Improved documentation and references to NIPs

#### 3. Type Safety Improvements

- Removed `any` types in favor of `unknown` for better type safety
- Added proper type constraints for tag filters
- Improved type definitions for crypto operations

### Breaking Changes

1. `NostrEvent.pubkey` is now a `string` instead of `PublicKey`
   ```typescript
   // Before
   event.pubkey.hex // ✅ worked
   
   // After
   event.pubkey // ✅ string value
   ```

2. Filter types are more strictly typed
   ```typescript
   // Before
   filter['#t'] = ['sometag']; // ✅ worked
   
   // After
   filter[`#${tagName}`] = ['value']; // ✅ type-safe way
   ```

3. Removed duplicate type definitions
   - Types are now only exported from the package root
   - Importing from subdirectories will show deprecation warnings

### Migration Steps

1. Update your imports to use the package root:
   ```typescript
   import { 
     NostrEvent,
     NostrEventKind,
     PublicKey
   } from 'nostr-crypto-utils';
   ```

2. Update pubkey handling:
   ```typescript
   // Before
   const pubkey = event.pubkey.hex;
   
   // After
   const pubkey = event.pubkey;
   ```

3. Update filter usage:
   ```typescript
   // Before
   const filter: NostrFilter = {
     '#t': ['tag'],
     authors: [pubkeyObj]
   };
   
   // After
   const filter: NostrFilter = {
     '#t': ['tag'],
     authors: [pubkeyString]
   };
   ```

### Future Changes

In v1.0.0, we plan to:
1. Remove deprecated type exports from subdirectories
2. Further enhance type safety with stricter validation
3. Add more comprehensive NIP support

Please test your application thoroughly after upgrading, as these changes might affect type checking in your codebase.
