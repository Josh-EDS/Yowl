// Get the form and error message elements
const form = document.getElementById('post-form');
const errorMessage = document.getElementById('error-message');
const imagePreview = document.getElementById('image-preview');
const fileInput = document.getElementById('post-url');

// Add an event listener to the form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check if the username and img_url are in the cookies
    const cookies = document.cookie.split(';');
    let username = '';
    let imgUrl = '';

    cookies.forEach((cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key === 'username') {
            username = value;
        } else if (key === 'imgUrl') {
            imgUrl = value;
        }
    });

    if (!username || !imgUrl) {
        // Redirect to /authentication if the cookies are not found
        window.location.href = '/authentication';
        return;
    }
    
    // Get the form data
    const text = document.getElementById('text').value;
    const localisation = document.getElementById('localisation').value;
    const file = fileInput.files[0];

    // Check if the file is uploaded
    if (!file) {
        errorMessage.textContent = 'Please upload a picture.';
        return;
    }

    // Upload the picture to Imgur
    const imgurClientId = '31ea1304079b7c9';
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                'Authorization': `Client-ID ${imgurClientId}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            // Get the Imgur image URL
            const postUrl = data.data.link;

            // Post the data to the Supabase database
            const supabaseUrl = 'https://rxacwdemlmdgkbcfpgfy.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4YWN3ZGVtbG1kZ2tiY2ZwZ2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNzk5MzUsImV4cCI6MjA1Mjk1NTkzNX0.sWK8Ku0QLPawq4abxgmF0X0v7orWD4vrmXgDn32esQk';
            const supabaseSecret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4YWN3ZGVtbG1kZ2tiY2ZwZ2Z5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzM3OTkzNSwiZXhwIjoyMDUyOTU1OTM1fQ.RpVasgcakzr-8JWcy_XcunHb8vb6_5bs4VBOfTvXOIw';

            try {
                const response = await fetch(`${supabaseUrl}/rest/v1/posts`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text,
                        localisation,
                        post_url: imgUrl,
                        img_url: postUrl,
                        likes: 0,
                        comments: 0,
                        username,
                        created_at: new Date(),
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Post created successfully!');
                    form.reset();
                } else {
                    console.error('Error creating post:', data);
                    errorMessage.textContent = 'Error creating post. Please try again.';
                }
            } catch (error) {
                console.error('Error creating post:', error);
                errorMessage.textContent = 'Error creating post. Please try again.';
            }
        } else {
            console.error('Error uploading picture:', data);
            errorMessage.textContent = 'Error uploading picture. Please try again.';
        }
    } catch (error) {
        console.error('Error uploading picture:', error);
        errorMessage.textContent = 'Error uploading picture. Please try again.';
    }
});

// Add an event listener to the file input
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];

    // Create a new FileReader
    const reader = new FileReader();

    // Add an event listener to the reader
    reader.addEventListener('load', () => {
        // Create a new image element
        const img = document.createElement('img');
        img.src = reader.result;
        imagePreview.innerHTML = '';
        imagePreview.appendChild(img);
    });

    // Read the file
    reader.readAsDataURL(file);
});
