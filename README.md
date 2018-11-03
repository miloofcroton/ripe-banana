# Ripe Bananas


** routes to fix:

get:
actor by id
reviewer by id

delete:
studios
actors



add this to the tests 
  .set('Authorization', `Bearer ${token}`)

add this above the test 

    let token
    beforeEach(() => {
        return withToken(users[0]).then(createdToken => {
            token = createdToken;
        });
    });

    only add authnetiication to user/reviewer 
    post/puts/deletes a review 


            .set('Authorization', `Bearer ${token}`) ....add this to the post put deletes or anything that needs auth...add this to every test along the beefore each 
