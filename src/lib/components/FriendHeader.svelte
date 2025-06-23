<script lang="ts">
    export let people: string[] = [];
    export let currentPersonId: string;
    export let peerNames: Record<string, string> = {};

    const getCurrentPerson = (): string => {
        if (!currentPersonId) {
            return 'Unknown';
        }
        
        // If we have a friendly name for this peer, use it
        if (peerNames[currentPersonId]) {
            return peerNames[currentPersonId];
        }
        
        // Otherwise, fall back to the peer ID
        return people.find((person) => person === currentPersonId) ?? 'Nobody';
    };
</script>

<div class="p-5">
    <p class="font-bold">Chat with {getCurrentPerson()}</p>
</div>