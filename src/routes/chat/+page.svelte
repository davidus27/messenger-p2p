<script lang="ts">
    import Chat from '$lib/components/Chat.svelte';
    import { chatStore } from '$lib/stores/chat';
    import type { Person, MessageFeed } from '$lib/types';

    // end of p2p
  
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
    let messageFeeds = new Map<number, MessageFeed[]>();
    
    // Initialize message feeds for each person
    people.forEach(person => {
      const numMessages = Math.floor(Math.random() * 5) + 1; // Random number between 1-5 messages
      const messages: MessageFeed[] = [];
      
      for (let i = 0; i < numMessages; i++) {
        const isHost = Math.random() > 0.5; // Randomly alternate between host/user
        messages.push({
          id: i,
          host: isHost,
          avatar: isHost ? 48 : person.avatar,
          name: isHost ? 'Jane' : person.name,
          timestamp: `Yesterday @ ${2 + i}:${Math.floor(Math.random() * 60).toString().padStart(2,'0')}pm`,
          message: lorem,
          color: 'preset-tonal-primary'
        });
      }
      
      messageFeeds.set(person.id, messages);
    });

    let currentMessage = '';
    let messageFeed = messageFeeds.get(currentPersonId) || [];
  
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
      
      // Update the current person's message feed
      const currentFeed = messageFeeds.get(currentPersonId) || [];
      messageFeeds.set(currentPersonId, [...currentFeed, newMessage]);
      messageFeed = messageFeeds.get(currentPersonId) || [];
      
      // Clear prompt
      currentMessage = '';
    }
  
    function handlePersonSelect(personId: number) {
      currentPersonId = personId;
      // Switch to the selected person's message feed
      messageFeed = messageFeeds.get(personId) || [];
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