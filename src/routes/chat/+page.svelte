<script lang="ts">
    import Chat from './chat.svelte';
    import type { Person, MessageFeed } from './chat.svelte';
  
    const lorem =
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident blanditiis quidem dolorum ab similique. Voluptatibus quibusdam unde mollitia corrupti assumenda libero. Quibusdam culpa illum unde asperiores accusantium! Unde, cupiditate tenetur.';
  
    // Navigation List
    const people: Person[] = [
      { id: 0, avatar: 14, name: 'Michael' },
      { id: 1, avatar: 40, name: 'Janet' },
      { id: 2, avatar: 31, name: 'Susan' },
      { id: 3, avatar: 56, name: 'Joey' },
      { id: 4, avatar: 24, name: 'Lara' },
      { id: 5, avatar: 9, name: 'Melissa' }
    ];
    let currentPersonId: number = people[0].id;
  
    // Messages
    let messageFeed: MessageFeed[] = [
      {
        id: 0,
        host: true,
        avatar: 48,
        name: 'Jane',
        timestamp: 'Yesterday @ 2:30pm',
        message: lorem,
        color: 'preset-tonal-primary'
      },
      {
        id: 1,
        host: false,
        avatar: 14,
        name: 'Michael',
        timestamp: 'Yesterday @ 2:45pm',
        message: lorem,
        color: 'preset-tonal-primary'
      },
      {
        id: 2,
        host: true,
        avatar: 48,
        name: 'Jane',
        timestamp: 'Yesterday @ 2:50pm',
        message: lorem,
        color: 'preset-tonal-primary'
      },
      {
        id: 3,
        host: false,
        avatar: 14,
        name: 'Michael',
        timestamp: 'Yesterday @ 2:52pm',
        message: lorem,
        color: 'preset-tonal-primary'
      }
    ];
    let currentMessage = '';
  
    function getCurrentTimestamp(): string {
      return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }
  
    function handleMessageAdd(message: string) {
      const newMessage = {
        id: messageFeed.length,
        host: true,
        avatar: 48,
        name: 'Jane',
        timestamp: `Today @ ${getCurrentTimestamp()}`,
        message: message,
        color: 'preset-tonal-primary'
      };
      // Update the message feed
      messageFeed = [...messageFeed, newMessage];
      // Clear prompt
      currentMessage = '';
    }
  
    function handlePersonSelect(personId: number) {
      currentPersonId = personId;
    }
</script>
  
<Chat
  {people}
  {currentPersonId}
  {messageFeed}
  {currentMessage}
  onMessageAdd={handleMessageAdd}
  onPersonSelect={handlePersonSelect}
/>