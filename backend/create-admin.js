// Create admin user
const createAdmin = async () => {
  const res = await fetch('http://localhost:5001/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: 'Admin@123',
      confirmPassword: 'Admin@123'
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
};

createAdmin();