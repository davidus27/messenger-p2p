<script lang="ts">
    import AvatarImage from './AvatarImage.svelte';
    import type { Person } from '$lib/types';

    export let people: Person[] = [];
    export let currentPersonId: number;
    export let onPersonSelect: (personId: number) => void;
    export let searchQuery: string = '';
    export let scrollChatBottom: (behavior?: 'auto' | 'instant' | 'smooth') => void;

    function getFilteredPeople() {
        return people.filter(person => 
            person.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    const switchToChat = (personId: number) => {
        console.log("switchToChat", personId);
		// this will change the chat to the personId
		currentPersonId = personId;
		onPersonSelect(personId);
		searchQuery = '';
		// Scroll to bottom of chat when switching
		scrollChatBottom('instant');
	};
</script>

<div class="space-y-4 overflow-y-auto p-4">
    <small class="opacity-50">Contacts</small>
    <div class="flex flex-col space-y-1">
        {#each getFilteredPeople() as person}
            <button
                type="button"
                class="card flex w-full items-center space-x-4 p-2 {person.id === currentPersonId
                    ? 'preset-filled-primary-500'
                    : 'bg-surface-hover-token'}"
                on:click={() => switchToChat(person.id)}
            >
                <AvatarImage name={person.name} small={false} />
                <span class="flex-1 text-start">
                    {person.name}
                </span>
            </button>
        {/each}
    </div>
</div>