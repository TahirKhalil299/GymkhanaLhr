# Auto-Swipe Currency Cards Functionality

## Overview
Added automatic swiping functionality to the currency cards that automatically moves to the next card every 2 seconds and loops back to the first card when it reaches the last one.

## Features Implemented

### 1. Auto-Swipe Timer
- **Interval**: 2 seconds between each swipe
- **Loop**: Automatically returns to first card after last card
- **Smooth Animation**: Animated transitions between cards

### 2. State Management
```typescript
const [currentCardIndex, setCurrentCardIndex] = useState(0);
const flatListRef = useRef<FlatList>(null);
```

### 3. Auto-Swipe Logic
```typescript
useEffect(() => {
  const autoSwipeInterval = setInterval(() => {
    if (currencies.length > 0) {
      const nextIndex = (currentCardIndex + 1) % currencies.length;
      setCurrentCardIndex(nextIndex);
      
      // Scroll to the next card
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }
  }, 2000); // 2 seconds interval

  return () => clearInterval(autoSwipeInterval);
}, [currentCardIndex, currencies.length]);
```

### 4. Manual Scroll Handling
```typescript
const handleScroll = (event: any) => {
  const contentOffset = event.nativeEvent.contentOffset.x;
  const cardWidth = screenWidth - 40;
  const index = Math.round(contentOffset / cardWidth);
  setCurrentCardIndex(index);
};
```

## Key Benefits

### 1. Automatic Rotation
- **2-second intervals**: Perfect timing for user engagement
- **Seamless loop**: Returns to first card after last card
- **No manual intervention**: Works automatically

### 2. User Interaction Support
- **Manual swiping**: Users can still manually swipe
- **Sync state**: Auto-swipe syncs with manual swipes
- **Smooth transitions**: Professional animation

### 3. Performance Optimized
- **useRef**: Efficient FlatList reference
- **scrollToIndex**: Direct navigation to specific cards
- **Cleanup**: Proper interval cleanup on unmount

## Technical Implementation

### Auto-Swipe Timer
```typescript
setInterval(() => {
  const nextIndex = (currentCardIndex + 1) % currencies.length;
  // Scroll to next card
}, 2000);
```

### Loop Logic
```typescript
const nextIndex = (currentCardIndex + 1) % currencies.length;
```
- Uses modulo operator for seamless looping
- Automatically returns to index 0 after last card

### Scroll Synchronization
```typescript
onScroll={handleScroll}
scrollEventThrottle={16}
```
- Tracks manual scroll position
- Updates current card index
- Maintains sync between auto and manual swipes

## User Experience

### 1. Automatic Display
- Cards automatically rotate every 2 seconds
- Users see all currency information without manual interaction
- Professional presentation of multiple currencies

### 2. Manual Override
- Users can manually swipe to any card
- Auto-swipe continues from current position
- No interference between auto and manual swipes

### 3. Visual Feedback
- Smooth animated transitions
- Clear indication of current card
- Professional scrolling behavior

## Configuration Options

### Timer Interval
```typescript
}, 2000); // Change this value to adjust timing
```

### Animation Settings
```typescript
scrollToIndex({
  index: nextIndex,
  animated: true, // Set to false for instant transitions
});
```

### Card Width Calculation
```typescript
const cardWidth = screenWidth - 40;
```

## Result

✅ **Automatic card rotation every 2 seconds**
✅ **Seamless loop back to first card**
✅ **Manual swipe support maintained**
✅ **Smooth animated transitions**
✅ **Professional user experience**
✅ **Performance optimized**

The currency cards now provide an engaging, automatic presentation of currency information with smooth transitions and professional user experience. 