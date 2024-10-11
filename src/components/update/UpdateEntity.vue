<template>
  <div>
    <button
      @click="openUpdateModal"
      class="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-2 rounded-lg shadow-md transition ease-in-out duration-200"
    >
      <i class="fas fa-edit"></i>
    </button>

    <!-- Update Alert -->
    <div
      v-if="alertVisible"
      class="fixed top-4 right-4 w-80 bg-green-500 text-white p-4 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out"
      :class="{'translate-y-0': alertVisible, 'translate-y-[-100px]': !alertVisible}"
      @click="alertVisible = false"
    >
      {{ alertMessage }}
    </div>

    <!-- Update Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h2 class="text-lg font-bold text-black mb-6 border-b pb-4">Update {{ entityName }}</h2>
        <form @submit.prevent="updateEntity" class="space-y-6">
          <!-- Form field: Name -->
          <div class="flex items-center space-x-2">
            <label for="name" class="w-1/4 text-gray-600 font-medium text-right">Name:</label>
            <div class="w-3/4">
              <input
                v-model="formData.name"
                id="name"
                type="text"
                class="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <div v-if="validationErrors.name" class="text-red-500 text-sm mt-1">
                {{ validationErrors.name }}
              </div>
            </div>
          </div>

          <!-- Form field: Username -->
          <div class="flex items-center space-x-2">
            <label for="username" class="w-1/4 text-gray-600 font-medium text-right">Username:</label>
            <div class="w-3/4">
              <input
                v-model="formData.username"
                id="username"
                type="text"
                class="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <div v-if="validationErrors.username" class="text-red-500 text-sm mt-1">
                {{ validationErrors.username }}
              </div>
            </div>
          </div>

          <!-- Form field: Password -->
          <div class="flex items-center space-x-2">
            <label for="password" class="w-1/4 text-gray-600 font-medium text-right">Password:</label>
            <div class="w-3/4">
              <input
                v-model="formData.password"
                id="password"
                type="text"
                class="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <div v-if="validationErrors.password" class="text-red-500 text-sm mt-1">
                {{ validationErrors.password }}
              </div>
            </div>
          </div>

          <!-- Form field: Lottery Type -->
          <div class="flex items-center space-x-2">
            <label for="lotteryType" class="w-1/4 text-gray-600 font-medium text-right">Lottery Type:</label>
            <div class="w-3/4">
              <input
                v-model="formData.lotteryType"
                id="lotteryType"
                type="text"
                class="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <div v-if="validationErrors.lotteryType" class="text-red-500 text-sm mt-1">
                {{ validationErrors.lotteryType }}
              </div>
            </div>
          </div>

          <!-- Form field: Phone Number -->
          <div class="flex items-center space-x-2">
            <label for="phoneNumber" class="w-1/4 text-gray-600 font-medium text-right">Phone Number:</label>
            <div class="w-3/4">
              <input
                v-model="formData.phoneNumber"
                id="phoneNumber"
                type="tel"
                class="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <div v-if="validationErrors.phoneNumber" class="text-red-500 text-sm mt-1">
                {{ validationErrors.phoneNumber }}
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded shadow-md transition ease-in-out duration-200"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow-lg transition ease-in-out duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { ref } from 'vue';

const props = defineProps({
  entityData: {
    type: Object,
    required: true
  },
  collectionName: {
    type: String,
    required: true
  },
  entityName: {
    type: String,
    required: true
  },
  onUpdate: {
    type: Function,
    required: false,  // Optional now
    default: () => {}  // Default empty function to prevent errors
  }
});

const showModal = ref(false);
const formData = ref({
  name: props.entityData.name || '',
  username: props.entityData.username || '',
  password: props.entityData.password || '',
  lotteryType: props.entityData.lotteryType || '',
  phoneNumber: props.entityData.phoneNumber || ''  // Corrected this
});

const validationErrors = ref({
  name: '',
  username: '',
  password: '',
  lotteryType: '',
  phoneNumber: ''
});

// Alert variables
const alertVisible = ref(false);
const alertMessage = ref('');

const openUpdateModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const updateEntity = async () => {
  // Reset previous errors
  Object.keys(validationErrors.value).forEach(key => {
    validationErrors.value[key] = '';
  });

  const { name, username, password, lotteryType, phoneNumber } = formData.value;

  let hasErrors = false;

  // Validation logic
  if (!name) {
    validationErrors.value.name = 'Name is required.';
    hasErrors = true;
  }
  if (!username) {
    validationErrors.value.username = 'Username is required.';
    hasErrors = true;
  }
  if (!password) {
    validationErrors.value.password = 'Password is required.';
    hasErrors = true;
  }
  if (!lotteryType) {
    validationErrors.value.lotteryType = 'Lottery type is required.';
    hasErrors = true;
  }
  if (!phoneNumber) {
    validationErrors.value.phoneNumber = 'Phone number is required.';
    hasErrors = true;
  }

  if (hasErrors) {
    return;
  }

  try {
    const db = getFirestore();
    const docRef = doc(db, props.collectionName, props.entityData.id);
    await updateDoc(docRef, formData.value);
    
    alertMessage.value = `${props.entityName} updated successfully.`;
    alertVisible.value = true;

    setTimeout(() => {
      alertVisible.value = false; // Hide the alert after 3 seconds
    }, 3000);

    closeModal();
    props.onUpdate();  // Call the update function
  } catch (error) {
    console.error('Error updating document: ', error);
    alert(`Error updating document: ${error.message}`);
  }
};
</script>
