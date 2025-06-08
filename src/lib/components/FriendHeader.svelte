<script lang="ts">
    import type { Person } from '$lib/types';

    export let people: Person[] = [];
	export let currentPersonId: number;

    const getCurrentPerson = (): string => {
		if (currentPersonId === undefined) {
			return 'Unknown';
		}
		return people.find((person) => person.id === currentPersonId)?.name ?? 'Unknown';
	};
</script>

<div class="p-5">
    <p class="font-bold">Chat with {getCurrentPerson()}</p>
</div>