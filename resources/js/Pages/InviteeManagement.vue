<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
    invitees: Array,
    stats: Object,
});

const showAddModal = ref(false);
const showEditModal = ref(false);
const showQrModal = ref(false);
const showShareModal = ref(false);
const selectedInvitee = ref(null);

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
    const message = `You're invited to Ian Jay & Karen Kate's Wedding! 🌟\n\nJuly 17, 2026 at 7:00 AM\nButuan City Cathedral\n\nPlease RSVP here: ${invitee.rsvp_url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};

const shareViaEmail = (invitee) => {
    const subject = "You're Invited to Our Wedding! 🌟";
    const body = `Dear ${invitee.name},

We're getting married and we'd love for you to join us!

Date: July 17, 2026
Time: 7:00 AM
Location: Butuan City Cathedral
Theme: Elegant Starry Night

Please RSVP by visiting: ${invitee.rsvp_url}

We can't wait to celebrate with you!

Love,
Ian Jay & Karen Kate`;
    
    window.location.href = `mailto:${invitee.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const downloadInvitationImage = async (invitee) => {
    // Create a canvas to generate invitation image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size (invitation card size)
    canvas.width = 1200;
    canvas.height = 1600;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0f172a'); // slate-900
    gradient.addColorStop(0.5, '#1e3a8a'); // blue-900
    gradient.addColorStop(1, '#312e81'); // indigo-900
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add stars
    ctx.fillStyle = '#fcd34d';
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 3 + 1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Title
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 60px serif';
    ctx.textAlign = 'center';
    ctx.fillText("You're Invited!", canvas.width / 2, 120);
    
    // Names
    ctx.fillStyle = '#fef3c7';
    ctx.font = '48px cursive';
    ctx.fillText('Ian Jay & Karen Kate', canvas.width / 2, 200);
    
    // Details
    ctx.fillStyle = '#fcd34d';
    ctx.font = '32px sans-serif';
    ctx.fillText('July 17, 2026 • 7:00 AM', canvas.width / 2, 280);
    ctx.fillText('Butuan City Cathedral', canvas.width / 2, 330);
    ctx.fillText('Butuan City', canvas.width / 2, 370);
    
    // Guest name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(invitee.name, canvas.width / 2, 480);
    
    // QR Code box
    const qrSize = 400;
    const qrX = (canvas.width - qrSize) / 2;
    const qrY = 550;
    
    // White background for QR code
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40);
    
    // Get QR code image
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.src = route('invitees.qrcode', invitee.id);
    
    await new Promise((resolve) => {
        qrImg.onload = () => {
            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
            resolve();
        };
    });
    
    // Instructions
    ctx.fillStyle = '#fcd34d';
    ctx.font = '28px sans-serif';
    ctx.fillText('Scan to RSVP', canvas.width / 2, qrY + qrSize + 80);
    
    // Footer
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '20px sans-serif';
    ctx.fillText('Under the Starry Sky', canvas.width / 2, canvas.height - 80);
    ctx.fillText('Please RSVP by June 30, 2026', canvas.width / 2, canvas.height - 40);
    
    // Download the image
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invitation-${invitee.name.replace(/\s+/g, '-').toLowerCase()}.png`;
        a.click();
        URL.revokeObjectURL(url);
    });
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
                                <tr v-for="invitee in invitees" :key="invitee.id" class="hover:bg-amber-50">
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
                                            @click="copyUrl(invitee.rsvp_url)"
                                            class="text-blue-600 hover:text-blue-900"
                                            title="Copy RSVP URL"
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
                <div class="mb-4 p-4 bg-white border-4 border-amber-400 rounded-lg inline-block">
                    <img :src="route('invitees.qrcode', selectedInvitee.id)" alt="QR Code" class="w-64 h-64">
                </div>
                <p class="text-sm text-gray-600 mb-4">Scan this QR code to access the RSVP form</p>
                <div class="flex gap-3 justify-center">
                    <button
                        @click="copyUrl(selectedInvitee.rsvp_url)"
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
                        @click="shareToMessenger(selectedInvitee.rsvp_url)"
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
                        @click="copyUrl(selectedInvitee.rsvp_url)"
                        class="w-full flex items-center gap-3 p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition border border-gray-300"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                        </svg>
                        <div class="text-left">
                            <div class="font-semibold">Copy RSVP Link</div>
                            <div class="text-xs opacity-90">Copy link to clipboard</div>
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
