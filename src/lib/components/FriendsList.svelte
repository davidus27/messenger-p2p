<script lang="ts">
    import AvatarImage from './AvatarImage.svelte';

    // Destructure props once
    const {
        removeChannel,
        currentPersonId, 
        onPersonSelect, 
        people = []
    }: { 
        removeChannel: (channel: string) => void,
        currentPersonId: string, 
        onPersonSelect: (personId: string) => void, 
        people?: string[] 
    } = $props();

    // Reactive state for search
    let searchQuery = $state('');

    // Derived filtered list
    const filteredPeople = $derived(() =>
        people.filter((person) =>
            person.toLowerCase().includes(searchQuery?.toLowerCase())
        )
    );

    // Safe switch function → do not assign currentPersonId (prop!)
    const switchToChat = (personId: string) => {
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
                class="card flex w-full items-center space-x-4 p-2 {person.toString() === currentPersonId
                    ? 'preset-filled-primary-500'
                    : 'bg-surface-hover-token'}"
                onclick={() => switchToChat(person)}
            >
                <AvatarImage name={person} small={false} />
                <span class="flex-1 text-start">
                    {person}
                </span>
            </button>
        {/each}
    </div>
</div>
