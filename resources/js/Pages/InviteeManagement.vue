<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { ref, computed } from 'vue';

const props = defineProps({
    invitees: Array,
    stats: Object,
    genericInvitationUrl: String,
    genericQrCodeUrl: String,
    genericQrCodeDownloadUrl: String,
});

const page = usePage();
const wedding = computed(() => page.props.wedding);

const showAddModal = ref(false);
const showEditModal = ref(false);
const showQrModal = ref(false);
const showShareModal = ref(false);
const selectedInvitee = ref(null);
const searchQuery = ref('');
const statusFilter = ref('all');

const filteredInvitees = computed(() => {
    const query = searchQuery.value.trim().toLocaleLowerCase();

    return props.invitees.filter((invitee) => {
        const matchesSearch = !query || [invitee.name, invitee.email, invitee.phone, invitee.notes]
            .some((value) => String(value || '').toLocaleLowerCase().includes(query));

        const matchesStatus = statusFilter.value === 'all'
            || (statusFilter.value === 'pending' && !invitee.rsvp_submitted)
            || (statusFilter.value === 'attending' && invitee.rsvp_submitted && invitee.rsvp_status === 'yes')
            || (statusFilter.value === 'declined' && invitee.rsvp_submitted && invitee.rsvp_status === 'no');

        return matchesSearch && matchesStatus;
    });
});

const clearFilters = () => {
    searchQuery.value = '';
    statusFilter.value = 'all';
};

const addForm = useForm({
    name: '',
    email: '',
    phone: '',
    party_size: 1,
    notes: '',
});

const editForm = useForm({
    name: '',
    email: '',
    phone: '',
    party_size: 1,
    notes: '',
});

const openAddModal = () => {
    addForm.reset();
    showAddModal.value = true;
};

const openEditModal = (invitee) => {
    selectedInvitee.value = invitee;
    editForm.name = invitee.name;
    editForm.email = invitee.email || '';
    editForm.phone = invitee.phone || '';
    editForm.party_size = invitee.party_size;
    editForm.notes = invitee.notes || '';
    showEditModal.value = true;
};

const openQrModal = (invitee) => {
    selectedInvitee.value = invitee;
    showQrModal.value = true;
};

const openShareModal = (invitee) => {
    selectedInvitee.value = invitee;
    showShareModal.value = true;
};

const shareToMessenger = (url) => {
    const messengerUrl = `fb-messenger://share?link=${encodeURIComponent(url)}`;
    window.open(messengerUrl, '_blank');
};

const shareToWhatsApp = (invitee) => {
    const message = `You're invited to ${wedding.value.couple.display_names}'s Wedding!\n\n${wedding.value.date.display} at ${wedding.value.date.ceremony_time}\n${wedding.value.venue.ceremony.name}\n\nView your personal invitation: ${invitee.invitation_url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};

const shareViaEmail = (invitee) => {
    const subject = "You're Invited to Our 25th Anniversary Celebration!";
    const body = `Dear ${invitee.name},

We're celebrating 25 years together and we'd love for you to join us!

Date: ${wedding.value.date.display}
Time: ${wedding.value.date.ceremony_time}
Location: ${wedding.value.venue.ceremony.name}
Occasion: ${wedding.value.tagline}

View your personal invitation and RSVP: ${invitee.invitation_url}

We look forward to celebrating this special milestone with you!

Love,
${wedding.value.couple.display_names}`;
    
    window.location.href = `mailto:${invitee.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const downloadInvitationImage = async (invitee) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1200;
    canvas.height = 1700;

    const silver = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    silver.addColorStop(0, '#d6d5d1');
    silver.addColorStop(0.48, '#f7f6f2');
    silver.addColorStop(1, '#c9cbd0');
    ctx.fillStyle = silver;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Silver double-line frame to match the invitation page.
    ctx.strokeStyle = 'rgba(99, 97, 91, 0.58)';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);
    ctx.strokeStyle = 'rgba(99, 97, 91, 0.36)';
    ctx.strokeRect(66, 66, canvas.width - 132, canvas.height - 132);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#58544e';
    ctx.font = '600 22px sans-serif';
    ctx.letterSpacing = '7px';
    ctx.fillText('A SILVER ANNIVERSARY CELEBRATION', canvas.width / 2, 135, 1000);

    ctx.fillStyle = '#282522';
    ctx.font = 'italic 68px Georgia, "Times New Roman", serif';
    ctx.letterSpacing = '0px';
    ctx.fillText(wedding.value.couple.display_names, canvas.width / 2, 230, 1020);

    ctx.strokeStyle = 'rgba(99, 97, 91, 0.42)';
    ctx.beginPath();
    ctx.moveTo(360, 295);
    ctx.lineTo(840, 295);
    ctx.stroke();
    ctx.fillStyle = '#746e64';
    ctx.font = 'italic 26px Georgia, "Times New Roman", serif';
    ctx.fillText('Celebrating 25 years of love', canvas.width / 2, 340, 900);

    ctx.fillStyle = '#6c665d';
    ctx.font = '600 19px sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('A PERSONAL INVITATION FOR', canvas.width / 2, 408, 950);
    ctx.fillStyle = '#282522';
    ctx.font = 'italic 44px Georgia, "Times New Roman", serif';
    ctx.letterSpacing = '0px';
    ctx.fillText(invitee.name, canvas.width / 2, 468, 1000);

    ctx.fillStyle = '#4c4944';
    ctx.font = '22px sans-serif';
    ctx.fillText(`${wedding.value.date.display} · ${wedding.value.date.ceremony_time}`, canvas.width / 2, 550, 1000);
    ctx.font = '28px Georgia, "Times New Roman", serif';
    ctx.fillText(wedding.value.venue.ceremony.name, canvas.width / 2, 608, 1000);
    ctx.font = '20px sans-serif';
    ctx.fillText(wedding.value.venue.ceremony.address || wedding.value.venue.ceremony.city, canvas.width / 2, 648, 1000);
    ctx.font = '20px sans-serif';
    ctx.fillText(`Reception · ${wedding.value.date.reception_time} · ${wedding.value.venue.reception.name}`, canvas.width / 2, 704, 1050);

    ctx.fillStyle = '#625d55';
    ctx.font = '600 18px sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('ATTIRE', canvas.width / 2, 780, 900);
    ctx.fillStyle = '#4c4944';
    ctx.font = '19px sans-serif';
    ctx.letterSpacing = '0px';
    ctx.fillText('Ladies · Long gown or dress in baby pink or powder blue', canvas.width / 2, 822, 1040);
    ctx.fillText('Gentlemen · Long-sleeve barong, khaki pants, black leather shoes', canvas.width / 2, 858, 1080);

    const qrSize = 360;
    const qrX = (canvas.width - qrSize) / 2;
    const qrY = 930;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qrX - 24, qrY - 24, qrSize + 48, qrSize + 48);
    ctx.strokeStyle = 'rgba(99, 97, 91, 0.42)';
    ctx.strokeRect(qrX - 24, qrY - 24, qrSize + 48, qrSize + 48);

    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    await new Promise((resolve) => {
        qrImg.onload = resolve;
        qrImg.onerror = resolve;
        qrImg.src = route('invitees.qrcode', invitee.id);
    });
    if (qrImg.naturalWidth) {
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
    }

    ctx.fillStyle = '#514d47';
    ctx.font = '600 21px sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('SCAN TO VIEW YOUR INVITATION & RSVP', canvas.width / 2, 1360, 1080);
    ctx.letterSpacing = '0px';
    ctx.font = '23px Georgia, "Times New Roman", serif';
    ctx.fillText(`Kindly RSVP by ${wedding.value.rsvp.deadline_display}`, canvas.width / 2, 1450, 1000);
    ctx.fillStyle = '#6c665d';
    ctx.font = 'italic 20px Georgia, "Times New Roman", serif';
    ctx.fillText(wedding.value.tagline, canvas.width / 2, 1530, 1000);

    canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invitation-${invitee.name.replace(/\s+/g, '-').toLowerCase()}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
};

const submitAdd = () => {
    addForm.post(route('invitees.store'), {
        onSuccess: () => {
            showAddModal.value = false;
            addForm.reset();
        },
    });
};

const submitEdit = () => {
    editForm.patch(route('invitees.update', selectedInvitee.value.id), {
        onSuccess: () => {
            showEditModal.value = false;
            editForm.reset();
        },
    });
};

const deleteInvitee = (invitee) => {
    if (confirm(`Are you sure you want to delete ${invitee.name}?`)) {
        useForm({}).delete(route('invitees.destroy', invitee.id));
    }
};

const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
};
</script>

<template>
    <Head title="Manage Invitees" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                </svg>
                Manage Invitees
            </h2>
        </template>

        <div class="py-12 bg-gradient-to-b from-slate-50 to-blue-50">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <section class="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg" aria-labelledby="generic-qr-heading">
                    <div class="grid grid-cols-1 items-center gap-6 p-6 md:grid-cols-[220px_1fr] md:p-8">
                        <div class="flex justify-center">
                            <img
                                :src="genericQrCodeUrl"
                                alt="Generic RSVP QR code"
                                class="h-52 w-52 border border-slate-200 bg-white p-3"
                            >
                        </div>
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Share with any guest</p>
                            <h3 id="generic-qr-heading" class="mt-2 text-xl font-semibold text-slate-900">Generic Invitation QR Code</h3>
                            <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                Guests who scan this code will open the main invitation. The RSVP section shows the response deadline and links to the general form where guests can enter their details and respond.
                            </p>
                            <p class="mt-3 break-all rounded-md bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600">{{ genericInvitationUrl }}</p>
                            <div class="mt-4 flex flex-wrap gap-3">
                                <a
                                    :href="genericQrCodeDownloadUrl"
                                    class="inline-flex items-center rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                                >
                                    Download QR SVG
                                </a>
                                <button
                                    type="button"
                                    @click="copyUrl(genericInvitationUrl)"
                                    class="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Copy invite link
                                </button>
                                <a
                                    :href="genericInvitationUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center px-2 py-2 text-sm font-semibold text-amber-700 hover:text-amber-800"
                                >
                                    Preview invitation
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div class="bg-white overflow-hidden shadow-lg rounded-lg border border-amber-400/20">
                        <div class="p-6">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 bg-amber-100 rounded-md p-3">
                                    <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Total Invitees</dt>
                                        <dd class="text-3xl font-semibold text-gray-900">{{ stats.total_invitees }}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white overflow-hidden shadow-lg rounded-lg border border-amber-400/20">
                        <div class="p-6">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                    <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Total Invited</dt>
                                        <dd class="text-3xl font-semibold text-gray-900">{{ stats.total_invited_people }}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white overflow-hidden shadow-lg rounded-lg border border-amber-400/20">
                        <div class="p-6">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
                                    <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">RSVP Submitted</dt>
                                        <dd class="text-3xl font-semibold text-gray-900">{{ stats.rsvp_submitted }}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white overflow-hidden shadow-lg rounded-lg border border-amber-400/20">
                        <div class="p-6">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 bg-amber-100 rounded-md p-3">
                                    <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Attending</dt>
                                        <dd class="text-3xl font-semibold text-gray-900">{{ stats.attending }}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Add Invitee Button -->
                <div class="mb-6">
                    <button
                        @click="openAddModal"
                        class="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-md hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/30 font-semibold flex items-center gap-2"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        Add Invitee
                    </button>
                </div>

                <!-- Search and RSVP filters -->
                <div class="mb-4 rounded-lg border border-amber-400/20 bg-white p-4 shadow-sm">
                    <div class="flex flex-col gap-3 md:flex-row md:items-center">
                        <label class="relative block flex-1">
                            <span class="sr-only">Search invitees</span>
                            <svg class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="11" cy="11" r="7" stroke-width="2" />
                                <path d="m20 20-4-4" stroke-width="2" stroke-linecap="round" />
                            </svg>
                            <input
                                v-model="searchQuery"
                                type="search"
                                placeholder="Search name, email, phone, or notes"
                                class="w-full rounded-md border-slate-300 py-2 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500"
                            >
                        </label>
                        <label class="flex items-center gap-2">
                            <span class="whitespace-nowrap text-sm font-medium text-slate-600">RSVP status</span>
                            <select
                                v-model="statusFilter"
                                class="min-w-44 rounded-md border-slate-300 py-2 text-sm text-slate-900 focus:border-amber-500 focus:ring-amber-500"
                            >
                                <option value="all">All invitees</option>
                                <option value="pending">No response</option>
                                <option value="attending">Attending</option>
                                <option value="declined">Not attending</option>
                            </select>
                        </label>
                        <button
                            v-if="searchQuery || statusFilter !== 'all'"
                            type="button"
                            @click="clearFilters"
                            class="self-start rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:self-auto"
                        >
                            Clear filters
                        </button>
                    </div>
                    <p class="mt-3 text-xs text-slate-500" aria-live="polite">
                        Showing {{ filteredInvitees.length }} of {{ invitees.length }} invitees
                    </p>
                </div>

                <!-- Success Message -->
                <div v-if="$page.props.flash?.success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p class="text-green-800 flex items-center gap-2">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        {{ $page.props.flash.success }}
                    </p>
                </div>

                <!-- Invitees Table -->
                <div class="bg-white overflow-hidden shadow-lg rounded-lg border border-amber-400/20">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gradient-to-r from-slate-800 to-blue-900">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-amber-100 uppercase tracking-wider">Name</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-amber-100 uppercase tracking-wider">Contact</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-amber-100 uppercase tracking-wider">Party Size</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-amber-100 uppercase tracking-wider">RSVP Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-amber-100 uppercase tracking-wider">Notes</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-amber-100 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-if="filteredInvitees.length === 0">
                                    <td colspan="6" class="px-6 py-12 text-center text-sm text-slate-500">
                                        {{ invitees.length === 0 ? 'No invitees have been added yet.' : 'No invitees match your search and filters.' }}
                                    </td>
                                </tr>
                                <tr v-for="invitee in filteredInvitees" :key="invitee.id" class="hover:bg-amber-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">{{ invitee.name }}</div>
                                        <div class="text-xs text-gray-500">Added: {{ invitee.created_at }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900" v-if="invitee.email">{{ invitee.email }}</div>
                                        <div class="text-sm text-gray-900" v-if="invitee.phone">{{ invitee.phone }}</div>
                                        <div class="text-sm text-gray-400" v-if="!invitee.email && !invitee.phone">No contact info</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {{ invitee.party_size }} {{ invitee.party_size === 1 ? 'person' : 'people' }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span v-if="!invitee.rsvp_submitted" class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                            No response
                                        </span>
                                        <span v-else-if="invitee.rsvp_status === 'yes'" class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                            ✓ Attending
                                        </span>
                                        <span v-else class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                            ✗ Not attending
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="text-sm text-gray-600 max-w-xs truncate" :title="invitee.notes">
                                            {{ invitee.notes || '-' }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            @click="openQrModal(invitee)"
                                            class="text-amber-600 hover:text-amber-900"
                                            title="View QR Code"
                                        >
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                                            </svg>
                                        </button>
                                        <button
                                            @click="openShareModal(invitee)"
                                            class="text-green-600 hover:text-green-900"
                                            title="Share Invitation"
                                        >
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                                            </svg>
                                        </button>
                                        <button
                                            @click="copyUrl(invitee.invitation_url)"
                                            class="text-blue-600 hover:text-blue-900"
                                            title="Copy Invitation URL"
                                        >
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                                            </svg>
                                        </button>
                                        <button
                                            @click="openEditModal(invitee)"
                                            class="text-indigo-600 hover:text-indigo-900"
                                            title="Edit"
                                        >
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            </svg>
                                        </button>
                                        <button
                                            @click="deleteInvitee(invitee)"
                                            class="text-red-600 hover:text-red-900"
                                            title="Delete"
                                        >
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="invitees.length === 0">
                                    <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                                        <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                        </svg>
                                        <p class="text-lg font-medium">No invitees yet</p>
                                        <p class="text-sm mt-1">Click "Add Invitee" to get started!</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Invitee Modal -->
        <div v-if="showAddModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50" @click.self="showAddModal = false">
            <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Add New Invitee</h3>
                    <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <form @submit.prevent="submitAdd" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                            v-model="addForm.name"
                            type="text"
                            required
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                            placeholder="John & Jane Doe"
                        >
                        <p v-if="addForm.errors.name" class="mt-1 text-sm text-red-600">{{ addForm.errors.name }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                v-model="addForm.email"
                                type="email"
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                placeholder="email@example.com"
                            >
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                v-model="addForm.phone"
                                type="tel"
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                placeholder="+1234567890"
                            >
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Party Size *</label>
                        <input
                            v-model.number="addForm.party_size"
                            type="number"
                            min="1"
                            max="10"
                            required
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                        >
                        <p class="mt-1 text-xs text-gray-500">How many people are invited (e.g., couple = 2)</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            v-model="addForm.notes"
                            rows="3"
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                            placeholder="Internal notes (e.g., table assignment, dietary restrictions)"
                        ></textarea>
                    </div>
                    <div class="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            @click="showAddModal = false"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            :disabled="addForm.processing"
                            class="px-4 py-2 text-sm font-medium text-slate-900 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md hover:from-amber-400 hover:to-amber-500 disabled:opacity-50"
                        >
                            {{ addForm.processing ? 'Adding...' : 'Add Invitee' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Edit Invitee Modal (similar to Add) -->
        <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50" @click.self="showEditModal = false">
            <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Edit Invitee</h3>
                    <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <form @submit.prevent="submitEdit" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                            v-model="editForm.name"
                            type="text"
                            required
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                        >
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                v-model="editForm.email"
                                type="email"
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                            >
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                v-model="editForm.phone"
                                type="tel"
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                            >
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Party Size *</label>
                        <input
                            v-model.number="editForm.party_size"
                            type="number"
                            min="1"
                            max="10"
                            required
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                        >
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            v-model="editForm.notes"
                            rows="3"
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                        ></textarea>
                    </div>
                    <div class="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            @click="showEditModal = false"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            :disabled="editForm.processing"
                            class="px-4 py-2 text-sm font-medium text-slate-900 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md hover:from-amber-400 hover:to-amber-500 disabled:opacity-50"
                        >
                            {{ editForm.processing ? 'Updating...' : 'Update Invitee' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- QR Code Modal -->
        <div v-if="showQrModal && selectedInvitee" class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50" @click.self="showQrModal = false">
            <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white text-center">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">QR Code - {{ selectedInvitee.name }}</h3>
                    <button @click="showQrModal = false" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div class="mb-4 p-3 bg-white border-4 border-amber-400 rounded-lg inline-block">
                    <img :src="route('invitees.qrcode', selectedInvitee.id)" alt="QR Code" class="w-64 h-64">
                </div>
                <p class="text-sm text-gray-600 mb-4">Scan this QR code to view personalized invitation and RSVP</p>
                <div class="flex gap-3 justify-center">
                    <button
                        @click="copyUrl(selectedInvitee.invitation_url)"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-2"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                        </svg>
                        Copy URL
                    </button>
                    <a
                        :href="route('invitees.qrcode.download', selectedInvitee.id)"
                        class="px-4 py-2 text-sm font-medium text-slate-900 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md hover:from-amber-400 hover:to-amber-500 flex items-center gap-2"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        Download
                    </a>
                </div>
            </div>
        </div>

        <!-- Share Modal -->
        <div v-if="showShareModal && selectedInvitee" class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50" @click.self="showShareModal = false">
            <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Share Invitation - {{ selectedInvitee.name }}</h3>
                    <button @click="showShareModal = false" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                <div class="space-y-3">
                    <!-- Download Invitation Image -->
                    <button
                        @click="downloadInvitationImage(selectedInvitee)"
                        class="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-lg hover:from-amber-400 hover:to-amber-500 transition shadow-lg"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        <div class="text-left">
                            <div class="font-semibold">Download Invitation Image</div>
                            <div class="text-xs opacity-90">Save invitation with QR code to share or print</div>
                        </div>
                    </button>

                    <!-- Share via WhatsApp -->
                    <button
                        @click="shareToWhatsApp(selectedInvitee)"
                        class="w-full flex items-center gap-3 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow"
                    >
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <div class="text-left">
                            <div class="font-semibold">Share via WhatsApp</div>
                            <div class="text-xs opacity-90">Send invitation link via WhatsApp</div>
                        </div>
                    </button>

                    <!-- Share via Messenger -->
                                        <button
                                            @click="shareToMessenger(selectedInvitee.invitation_url)"
                                            class="w-full flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
                                        >
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.898 1.454 5.488 3.727 7.198V22l3.556-1.955c.95.262 1.956.402 2.994.402 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm.994 12.455l-2.583-2.758-5.031 2.758 5.536-5.879 2.647 2.758 4.967-2.758-5.536 5.879z"/>
                        </svg>
                        <div class="text-left">
                            <div class="font-semibold">Share via Messenger</div>
                            <div class="text-xs opacity-90">Send invitation link via Facebook Messenger</div>
                        </div>
                    </button>

                    <!-- Share via Email -->
                    <button
                        @click="shareViaEmail(selectedInvitee)"
                        class="w-full flex items-center gap-3 p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <div class="text-left">
                            <div class="font-semibold">Share via Email</div>
                            <div class="text-xs opacity-90">Send invitation via email</div>
                        </div>
                    </button>

                                    <!-- Copy URL -->
                                    <button
                                        @click="copyUrl(selectedInvitee.invitation_url)"
                                        class="w-full flex items-center gap-3 p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition border border-gray-300"
                                    >
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                                        </svg>
                                        <div class="text-left">
                                            <div class="font-semibold">Copy Invitation Link</div>
                                            <div class="text-xs opacity-90">Copy personalized invitation link to clipboard</div>
                                        </div>
                                    </button>
                </div>

                <div class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p class="text-xs text-amber-800">
                        <strong>Tip:</strong> Download the invitation image to share on social media, print it, or send via any messaging app!
                    </p>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
