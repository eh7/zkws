/*
* @swagger
* /api/resource:
* get:
* summary: Get a resource
* description: Get a specific resource by ID.
* parameters:
* — in: path
* name: id
* required: true
* description: ID of the resource to retrieve.
* schema:
* type: string
* responses:
* 200:
* description: Successful response
*/
app.get('/api/resource/:id', (req, res) => {
  // Your route logic goes here
  res.json({
    "message": "/api/resource/:id"
  })
});
