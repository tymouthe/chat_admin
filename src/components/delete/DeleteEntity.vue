<template>
  <div>
    <button
      @click="openModal"
      class="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-2 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
    >
      <i class="fas fa-trash-alt"></i> <!-- Updated Bin Icon -->
    </button>

    <transition name="fade">
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg p-6 shadow-lg max-w-md w-full mx-4">
          <h2 class="text-xl font-semibold text-center mb-4">Confirm Deletion</h2>
          <p class="text-gray-700 text-center">Are you sure you want to delete <strong class="text-blue-600">{{ username }}</strong>?</p>
          <div class="flex justify-center mt-4 space-x-2">
            <button 
              @click="deleteEntity" 
              class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Delete
            </button>
            <button 
              @click="closeModal" 
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import { db } from '~/firebase/firebase';

const props = defineProps({
  entityId: {
    type: String,
    required: true
  },
  collectionName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  onDelete: {
    type: Function,
    required: true,
    default: () => {
      console.warn("onDelete function is not provided.");
    }
  }
});

const showModal = ref(false);
const username = ref('');

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const deleteEntity = async () => {
  try {
    await deleteDoc(doc(db, props.collectionName, props.entityId));
    alert(`User ${username.value} deleted successfully.`);
    
    // Debugging line to check if onDelete is a function
    console.log('onDelete:', props.onDelete);

    props.onDelete(); // Call the onDelete function to refresh the list
  } catch (error) {
    console.error('Error deleting document: ', error);
    alert(`Error deleting user: ${error.message}`);
  } finally {
    closeModal(); // Close modal after the operation
  }
};

// Function to fetch the username from Firestore
const fetchUsername = async () => {
  try {
    const userDoc = await getDoc(doc(db, props.collectionName, props.entityId));
    if (userDoc.exists()) {
      username.value = userDoc.data().username; // Adjust the field name based on your Firestore structure
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching username: ", error);
  }
};

// Fetch username when the component is mounted
onMounted(() => {
  fetchUsername();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
