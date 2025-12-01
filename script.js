// Sample Data (Empty to start)
let currentUser = null;
let tasks = [];

// DOM Elements
const authPage = document.getElementById('authPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const customerDashboard = document.getElementById('customerDashboard');
const workerDashboard = document.getElementById('workerDashboard');
const postTaskView = document.getElementById('postTaskView');
const reviewsView = document.getElementById('reviewsView');
const customerTasks = document.getElementById('customerTasks');
const workerTasks = document.getElementById('workerTasks');
const newTaskForm = document.getElementById('newTaskForm');
const postTaskBtn = document.getElementById('postTaskBtn');
const backToDashboardBtn = document.getElementById('backToDashboardBtn');
const taskDetailsModal = document.getElementById('taskDetailsModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const reviewModal = document.getElementById('reviewModal');
const closeReviewModalBtn = document.getElementById('closeReviewModalBtn');
const customerReviewModal = document.getElementById('customerReviewModal');
const closeCustomerReviewModalBtn = document.getElementById('closeCustomerReviewModalBtn');
const reviewForm = document.getElementById('reviewForm');
const customerReviewForm = document.getElementById('customerReviewForm');
const ratingStars = document.querySelectorAll('.star');
const customerRatingStars = document.querySelectorAll('#customerRatingStars .star');
const selectedRating = document.getElementById('selectedRating');
const customerSelectedRating = document.getElementById('customerSelectedRating');
const reviewsList = document.getElementById('reviewsList');
const logoutBtn = document.getElementById('logoutBtn');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userRole = document.getElementById('userRole');
const workerAvatar = document.getElementById('workerAvatar');
const workerName = document.getElementById('workerName');
const filterBtns = document.querySelectorAll('.filter-btn');
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');

// Current task for review
let currentTaskForReview = null;
let currentTaskForCustomerReview = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
    
    // Auth tabs
    loginTab.addEventListener('click', () => switchAuthTab('login'));
    signupTab.addEventListener('click', () => switchAuthTab('signup'));
    
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    
    // Signup form
    signupForm.addEventListener('submit', handleSignup);
    
    // Post task button
    postTaskBtn.addEventListener('click', () => showView('postTask'));
    
    // Back to dashboard button
    backToDashboardBtn.addEventListener('click', () => showDashboard());
    
    // Modal close buttons
    closeModalBtn.addEventListener('click', () => taskDetailsModal.classList.remove('active'));
    closeReviewModalBtn.addEventListener('click', () => reviewModal.classList.remove('active'));
    closeCustomerReviewModalBtn.addEventListener('click', () => customerReviewModal.classList.remove('active'));
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === taskDetailsModal) {
            taskDetailsModal.classList.remove('active');
        }
        if (e.target === reviewModal) {
            reviewModal.classList.remove('active');
        }
        if (e.target === customerReviewModal) {
            customerReviewModal.classList.remove('active');
        }
    });
    
    // Rating stars
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            selectedRating.value = rating;
            
            ratingStars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
    
    customerRatingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            customerSelectedRating.value = rating;
            
            customerRatingStars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
    
    // Review forms
    reviewForm.addEventListener('submit', handleReviewSubmit);
    customerReviewForm.addEventListener('submit', handleCustomerReviewSubmit);
    
    // New task form
    newTaskForm.addEventListener('submit', handleNewTask);
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (currentUser.type === 'customer') {
                loadCustomerTasks(filter);
            } else {
                loadWorkerTasks(filter);
            }
        });
    });
    
    // Sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.getAttribute('data-view');
            
            if (view === 'myTasks' || view === 'availableTasks') {
                showDashboard();
            } else {
                showView(view);
            }
            
            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
});

// Functions
function switchAuthTab(tab) {
    if (tab === 'login') {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Demo accounts for testing
    if (email === 'customer@example.com' && password === 'password') {
        if (confirm('Login as demo customer?')) {
            currentUser = {
                name: 'John Customer',
                email: email,
                phone: '7701234567',
                type: 'customer',
                avatar: 'J'
            };
        } else {
            return;
        }
    } else if (email === 'worker@example.com' && password === 'password') {
        if (confirm('Login as demo worker?')) {
            currentUser = {
                name: 'Alex Worker',
                email: email,
                phone: '7707654321',
                type: 'worker',
                avatar: 'A'
            };
        } else {
            return;
        }
    } else {
        // Create a mock user based on input
        const name = email.split('@')[0];
        currentUser = {
            name: name.charAt(0).toUpperCase() + name.slice(1),
            email: email,
            phone: '7700000000',
            type: 'customer',
            avatar: name.charAt(0).toUpperCase()
        };
    }
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showDashboard();
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
    
    // Simple validation
    if (!name || !email || !phone || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Create user
    currentUser = {
        name: name,
        email: email,
        phone: phone,
        type: userType,
        avatar: name.charAt(0).toUpperCase()
    };
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showDashboard();
}

function showDashboard() {
    authPage.style.display = 'none';
    dashboardPage.style.display = 'block';
    
    // Update user info
    if (currentUser) {
        userAvatar.textContent = currentUser.avatar;
        userName.textContent = currentUser.name;
        userRole.textContent = currentUser.type === 'customer' ? 'Customer' : 'Worker';
        
        // Update worker info if applicable
        if (currentUser.type === 'worker') {
            workerAvatar.textContent = currentUser.avatar;
            workerName.textContent = currentUser.name;
        }
        
        // Show appropriate dashboard
        if (currentUser.type === 'customer') {
            customerDashboard.style.display = 'block';
            workerDashboard.style.display = 'none';
            loadCustomerTasks('all');
        } else {
            customerDashboard.style.display = 'none';
            workerDashboard.style.display = 'block';
            loadWorkerTasks('all');
        }
        
        // Hide other views
        postTaskView.style.display = 'none';
        reviewsView.style.display = 'none';
        
        // Update sidebar active link
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (currentUser.type === 'customer' && link.getAttribute('data-view') === 'myTasks') {
                link.classList.add('active');
            } else if (currentUser.type === 'worker' && link.getAttribute('data-view') === 'availableTasks') {
                link.classList.add('active');
            }
        });
    }
}

function showView(view) {
    // Hide all views
    customerDashboard.style.display = 'none';
    workerDashboard.style.display = 'none';
    postTaskView.style.display = 'none';
    reviewsView.style.display = 'none';
    
    // Show requested view
    if (view === 'postTask') {
        postTaskView.style.display = 'block';
        // Set tomorrow's date as default
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(14, 0, 0);
        document.getElementById('taskTime').value = tomorrow.toISOString().slice(0, 16);
    } else if (view === 'reviews') {
        reviewsView.style.display = 'block';
        loadReviews();
    }
}

function loadCustomerTasks(filter) {
    customerTasks.innerHTML = '';
    
    let filteredTasks = tasks;
    
    // Filter tasks based on status
    if (filter !== 'all') {
        filteredTasks = tasks.filter(task => task.status === filter);
    }
    
    // Filter tasks for current customer
    filteredTasks = filteredTasks.filter(task => task.customer === currentUser.name);
    
    if (filteredTasks.length === 0) {
        customerTasks.innerHTML = `
            <div class="no-tasks" style="grid-column: 1 / -1;">
                <i class="fas fa-clipboard-list"></i>
                <h3>No tasks yet</h3>
                <p>Create your first task to get started!</p>
                <button class="btn btn-primary" id="postTaskFromEmptyBtn" style="margin-top: 15px;">
                    <i class="fas fa-plus"></i> Post New Task
                </button>
            </div>
        `;
        
        document.getElementById('postTaskFromEmptyBtn')?.addEventListener('click', () => showView('postTask'));
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskCard = createTaskCard(task, 'customer');
        customerTasks.appendChild(taskCard);
    });
}

function loadWorkerTasks(filter) {
    workerTasks.innerHTML = '';
    
    let filteredTasks = tasks;
    
    // Filter tasks based on status
    if (filter === 'posted') {
        filteredTasks = tasks.filter(task => task.status === 'posted');
    } else if (filter === 'accepted') {
        filteredTasks = tasks.filter(task => task.status === 'accepted' && task.worker === currentUser.name);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.status === 'completed' && task.worker === currentUser.name);
    } else {
        // For 'all', show available tasks + worker's accepted/completed tasks
        filteredTasks = tasks.filter(task => 
            task.status === 'posted' || 
            (task.worker === currentUser.name && (task.status === 'accepted' || task.status === 'completed'))
        );
    }
    
    if (filteredTasks.length === 0) {
        workerTasks.innerHTML = `
            <div class="no-tasks" style="grid-column: 1 / -1;">
                <i class="fas fa-clipboard-list"></i>
                <h3>No tasks available</h3>
                <p>${filter === 'posted' ? 'No tasks have been posted yet. Check back later!' : 'You have no tasks in this category.'}</p>
            </div>
        `;
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskCard = createTaskCard(task, 'worker');
        workerTasks.appendChild(taskCard);
    });
}

function createTaskCard(task, userType) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.dataset.taskId = task.id;
    
    // Status badge
    let statusBadge = '';
    if (task.status === 'posted') {
        statusBadge = '<span class="task-status status-posted">Posted</span>';
    } else if (task.status === 'accepted') {
        statusBadge = '<span class="task-status status-accepted">Accepted</span>';
    } else if (task.status === 'completed') {
        statusBadge = '<span class="task-status status-completed">Completed</span>';
    } else if (task.status === 'canceled') {
        statusBadge = '<span class="task-status status-canceled">Canceled</span>';
    }
    
    // Action buttons
    let actionButtons = '';
    if (userType === 'customer') {
        if (task.status === 'posted') {
            actionButtons = `
                <button class="btn btn-secondary btn-view-details">View Details</button>
                <button class="btn btn-danger btn-cancel-task">Cancel</button>
            `;
        } else if (task.status === 'completed') {
            // Customer can review worker after task completion
            const hasCustomerReview = task.reviews.some(review => review.reviewer === currentUser.name && review.type === 'customer_review');
            actionButtons = `
                <button class="btn btn-secondary btn-view-details">View Details</button>
                ${!hasCustomerReview ? '<button class="btn btn-primary btn-rate-worker">Rate Worker</button>' : ''}
            `;
        } else {
            actionButtons = `
                <button class="btn btn-secondary btn-view-details">View Details</button>
            `;
        }
    } else {
        if (task.status === 'posted') {
            actionButtons = `
                <button class="btn btn-secondary btn-view-details">View Details</button>
                <button class="btn btn-success btn-accept-task">Accept</button>
            `;
        } else if (task.status === 'accepted' && task.worker === currentUser.name) {
            actionButtons = `
                <button class="btn btn-secondary btn-view-details">View Details</button>
                <button class="btn btn-success btn-complete-task">Complete Task</button>
            `;
        } else if (task.status === 'completed' && task.worker === currentUser.name) {
            // Worker can review task/experience
            const hasWorkerReview = task.reviews.some(review => review.reviewer === currentUser.name && review.type === 'worker_review');
            actionButtons = `
                <button class="btn btn-secondary btn-view-details">View Details</button>
                ${!hasWorkerReview ? '<button class="btn btn-primary btn-leave-review">Leave Review</button>' : ''}
            `;
        } else {
            actionButtons = `
                <button class="btn btn-secondary btn-view-details">View Details</button>
            `;
        }
    }
    
    card.innerHTML = `
        <div class="task-header">
            <h3 class="task-title">${task.title}</h3>
            <p class="task-description">${task.description}</p>
        </div>
        <div class="task-details">
            <div class="task-detail">
                <i class="fas fa-dollar-sign"></i>
                <span class="task-price">$${task.payment}</span>
            </div>
            <div class="task-detail">
                <i class="fas fa-map-marker-alt"></i>
                <span>${task.location}</span>
            </div>
            <div class="task-detail">
                <i class="fas fa-calendar-alt"></i>
                <span>${task.scheduledTime}</span>
            </div>
            <div class="task-detail">
                <i class="fas fa-user"></i>
                <span>Customer: ${task.customer}</span>
            </div>
            ${task.worker ? `
            <div class="task-detail">
                <i class="fas fa-user-check"></i>
                <span>Worker: ${task.worker}</span>
            </div>
            ` : ''}
        </div>
        <div class="task-footer">
            ${statusBadge}
            <div class="task-actions">
                ${actionButtons}
            </div>
        </div>
    `;
    
    // Add event listeners to buttons
    const viewDetailsBtn = card.querySelector('.btn-view-details');
    viewDetailsBtn.addEventListener('click', () => showTaskDetails(task.id));
    
    if (userType === 'customer') {
        const cancelBtn = card.querySelector('.btn-cancel-task');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => cancelTask(task.id));
        }
        
        const rateWorkerBtn = card.querySelector('.btn-rate-worker');
        if (rateWorkerBtn) {
            rateWorkerBtn.addEventListener('click', () => openCustomerReviewModal(task.id));
        }
    } else {
        const acceptBtn = card.querySelector('.btn-accept-task');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to accept this task?')) {
                    acceptTask(task.id);
                }
            });
        }
        
        const completeBtn = card.querySelector('.btn-complete-task');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => {
                if (confirm('Mark this task as completed?')) {
                    completeTask(task.id);
                }
            });
        }
        
        const leaveReviewBtn = card.querySelector('.btn-leave-review');
        if (leaveReviewBtn) {
            leaveReviewBtn.addEventListener('click', () => openReviewModal(task.id));
        }
    }
    
    return card;
}

function showTaskDetails(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    document.getElementById('modalTaskTitle').textContent = task.title;
    
    let reviewsHtml = '';
    if (task.reviews.length > 0) {
        reviewsHtml = `
            <h3 style="margin-top: 20px; margin-bottom: 15px;">Reviews</h3>
            ${task.reviews.map(review => `
                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-name">${review.reviewer}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                    <div class="review-rating">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                    </div>
                    <div class="review-text">${review.comment}</div>
                </div>
            `).join('')}
        `;
    } else {
        reviewsHtml = '<p style="text-align: center; color: var(--gray); margin-top: 20px;">No reviews yet</p>';
    }
    
    document.getElementById('modalTaskBody').innerHTML = `
        <div class="task-details">
            <div class="task-detail">
                <i class="fas fa-dollar-sign"></i>
                <span class="task-price">$${task.payment}</span>
            </div>
            <div class="task-detail">
                <i class="fas fa-map-marker-alt"></i>
                <span>${task.location}</span>
            </div>
            <div class="task-detail">
                <i class="fas fa-calendar-alt"></i>
                <span>${task.scheduledTime}</span>
            </div>
            <div class="task-detail">
                <i class="fas fa-user"></i>
                <span>Customer: ${task.customer}</span>
            </div>
            ${task.worker ? `
            <div class="task-detail">
                <i class="fas fa-user-check"></i>
                <span>Worker: ${task.worker}</span>
            </div>
            ` : ''}
            <div class="task-detail">
                <i class="fas fa-phone"></i>
                <span>Contact: ${task.customerPhone}</span>
            </div>
        </div>
        <div style="margin-top: 25px;">
            <h3 style="margin-bottom: 15px;">Description</h3>
            <p>${task.description}</p>
        </div>
        ${reviewsHtml}
    `;
    
    taskDetailsModal.classList.add('active');
}

function handleNewTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const category = document.getElementById('taskCategory').value;
    const payment = document.getElementById('taskPayment').value;
    const location = document.getElementById('taskLocation').value;
    const time = document.getElementById('taskTime').value;
    
    // Format the date
    const dateObj = new Date(time);
    const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}.${(dateObj.getMonth()+1).toString().padStart(2, '0')}.${dateObj.getFullYear()}, ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:00`;
    
    // Create new task
    const newTask = {
        id: tasks.length + 1,
        title: title,
        description: description,
        category: category,
        payment: parseFloat(payment),
        location: location,
        scheduledTime: formattedDate,
        customer: currentUser.name,
        customerPhone: currentUser.phone,
        worker: null,
        status: 'posted',
        reviews: []
    };
    
    tasks.push(newTask);
    
    // Reset form
    newTaskForm.reset();
    
    // Set default time for next task
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0);
    document.getElementById('taskTime').value = tomorrow.toISOString().slice(0, 16);
    
    // Show success message and return to dashboard
    alert('Task posted successfully!');
    showDashboard();
    loadCustomerTasks('all');
}

function acceptTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].worker = currentUser.name;
        tasks[taskIndex].status = 'accepted';
        
        // Reload tasks
        loadWorkerTasks('all');
        alert('Task accepted successfully!');
    }
}

function completeTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = 'completed';
        
        // Reload tasks
        loadWorkerTasks('all');
        alert('Task marked as completed!');
    }
}

function cancelTask(taskId) {
    if (confirm('Are you sure you want to cancel this task?')) {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = 'canceled';
            
            // Reload tasks
            loadCustomerTasks('all');
            alert('Task cancelled successfully!');
        }
    }
}

function openReviewModal(taskId) {
    currentTaskForReview = taskId;
    reviewModal.classList.add('active');
    
    // Reset stars to default
    selectedRating.value = 5;
    ratingStars.forEach((star, index) => {
        if (index < 5) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    // Reset comment
    document.getElementById('reviewComment').value = '';
}

function openCustomerReviewModal(taskId) {
    currentTaskForCustomerReview = taskId;
    customerReviewModal.classList.add('active');
    
    // Reset stars to default
    customerSelectedRating.value = 5;
    customerRatingStars.forEach((star, index) => {
        if (index < 5) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    // Reset comment
    document.getElementById('customerReviewComment').value = '';
}

function handleReviewSubmit(e) {
    e.preventDefault();
    
    const rating = parseInt(selectedRating.value);
    const comment = document.getElementById('reviewComment').value;
    
    if (!comment) {
        alert('Please write a comment');
        return;
    }
    
    const taskIndex = tasks.findIndex(t => t.id === currentTaskForReview);
    if (taskIndex !== -1) {
        const today = new Date();
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth()+1).toString().padStart(2, '0')}.${today.getFullYear()}`;
        
        tasks[taskIndex].reviews.push({
            reviewer: currentUser.name,
            rating: rating,
            comment: comment,
            date: formattedDate,
            type: 'worker_review'
        });
        
        // Close modal
        reviewModal.classList.remove('active');
        
        // Reload tasks
        loadWorkerTasks('all');
        
        alert('Review submitted successfully!');
    }
}

function handleCustomerReviewSubmit(e) {
    e.preventDefault();
    
    const rating = parseInt(customerSelectedRating.value);
    const comment = document.getElementById('customerReviewComment').value;
    
    if (!comment) {
        alert('Please write a comment');
        return;
    }
    
    const taskIndex = tasks.findIndex(t => t.id === currentTaskForCustomerReview);
    if (taskIndex !== -1) {
        const today = new Date();
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth()+1).toString().padStart(2, '0')}.${today.getFullYear()}`;
        
        tasks[taskIndex].reviews.push({
            reviewer: currentUser.name,
            rating: rating,
            comment: comment,
            date: formattedDate,
            type: 'customer_review'
        });
        
        // Close modal
        customerReviewModal.classList.remove('active');
        
        // Reload tasks
        loadCustomerTasks('all');
        
        alert('Thank you for your review!');
    }
}

function loadReviews() {
    reviewsList.innerHTML = '';
    
    // Get all reviews from tasks where current user is either customer or worker
    const userReviews = [];
    
    tasks.forEach(task => {
        // If user is customer and they posted the task
        if (currentUser.type === 'customer' && task.customer === currentUser.name) {
            task.reviews.forEach(review => {
                userReviews.push({
                    taskTitle: task.title,
                    ...review
                });
            });
        }
        
        // If user is worker and they worked on the task
        if (currentUser.type === 'worker' && task.worker === currentUser.name) {
            task.reviews.forEach(review => {
                userReviews.push({
                    taskTitle: task.title,
                    ...review
                });
            });
        }
    });
    
    if (userReviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="no-tasks" style="background: transparent; padding: 30px 0;">
                <i class="fas fa-star"></i>
                <h3>No reviews yet</h3>
                <p>${currentUser.type === 'customer' ? 'Tasks need to be completed by workers to receive reviews.' : 'Complete tasks to receive reviews!'}</p>
            </div>
        `;
        return;
    }
    
    userReviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        
        reviewCard.innerHTML = `
            <div class="review-header">
                <div>
                    <div class="reviewer-name">${review.reviewer}</div>
                    <div style="font-size: 0.9rem; color: var(--gray);">Task: ${review.taskTitle}</div>
                </div>
                <div class="review-date">${review.date}</div>
            </div>
            <div class="review-rating">
                ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
            </div>
            <div class="review-text">${review.comment}</div>
        `;
        
        reviewsList.appendChild(reviewCard);
    });
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Reset forms
    loginForm.reset();
    signupForm.reset();
    
    // Show auth page
    authPage.style.display = 'flex';
    dashboardPage.style.display = 'none';
    
    // Switch to login tab
    switchAuthTab('login');
}