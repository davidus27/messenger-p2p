<script lang="ts">
    import AvatarImage from './AvatarImage.svelte';
    import type { Person } from '../types/types';

    // Destructure props once
    const { 
        currentPersonId, 
        onPersonSelect, 
        scrollChatBottom, 
        people = [] 
    }: { 
        currentPersonId: number, 
        onPersonSelect: (personId: number) => void, 
        scrollChatBottom: (behavior?: 'auto' | 'instant' | 'smooth') => void, 
        people?: Person[] 
    } = $props();

    // Reactive state for search
    let searchQuery = $state('');

    // Derived filtered list
    const filteredPeople = $derived(() =>
        people.filter((person) =>
            person.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Safe switch function → do not assign currentPersonId (prop!)
    const switchToChat = (personId: number) => {
        console.log("switchToChat", personId);
        onPersonSelect(personId);
        searchQuery = '';
    };
</script>


<div class="space-y-4 overflow-y-auto p-4">
    
    <header class="pt-18 border-surface-200-800 border-b-[1px] p-4">
    <input
        bind:value={searchQuery}
        class="input mb-2"
        type="search"
        placeholder="Search contacts..."
    />
    </header>


    <small class="opacity-50">Contacts</small>

    <div class="flex flex-col space-y-1">
        {#each filteredPeople() as person}
            <button
                type="button"
                class="card flex w-full items-center space-x-4 p-2 {person.id === currentPersonId
                    ? 'preset-filled-primary-500'
                    : 'bg-surface-hover-token'}"
                onclick={() => switchToChat(person.id)}
            >
                <AvatarImage name={person.name} small={false} />
                <span class="flex-1 text-start">
                    {person.name}
                </span>
            </button>
        {/each}
    </div>
</div>
