const { getErrors } = require('../util/helpers');
const Film = require('../../lib/models/Film');
const Studio = require('../../lib/models/Studio');
const Actor = require('../../lib/models/Actor');
const Chance = require('chance');
const chance = new Chance();

describe('Film model', () => {

    it('validates a good model', () => {

        const studio = new Studio(
            {
                name: chance.name(),
                address: {
                    city: chance.city(),
                    state: chance.state(),
                    country: chance.country({ full: true })
                }
            });
        
        const actor = new Actor(
            {
                name: chance.name(),
                dob: chance.birthday(),
                pob: chance.city()
            });
            
        const data = {
            title: chance.word(),
            studio: studio._id,
            released: chance.natural({ min: 1900, max: 2050 }),
            cast: [{
                role: chance.name(),
                actor: actor._id
            }]
        };

        const film = new Film(data);
        const jsonFilm = film.toJSON();
        expect(jsonFilm).toEqual({ 
            ...data, 
            _id: expect.any(Object), 
            cast: 
                [{
                    _id: expect.any(Object),
                    ...data.cast[0]
                }] 
        });
    });

    it('requires a title', () => {

        const studio = new Studio(
            {
                name: chance.name(),
                address: {
                    city: chance.city(),
                    state: chance.state(),
                    country: chance.country({ full: true })
                }
            });
        
        const actor = new Actor(
            {
                name: chance.name(),
                dob: chance.birthday(),
                pob: chance.city()
            });
            
        const data = {
            studio: studio._id,
            released: chance.natural({ min: 1900, max: 2050 }),
            cast: [{
                role: chance.name(),
                actor: actor._id
            }]
        };

        const film = new Film(data);

        const errors = getErrors(film.validateSync(), 1);
        expect(errors.title.properties.message).toEqual('Path `title` is required.');
    });

    it('requires a studio', () => {
        
        const actor = new Actor(
            {
                name: chance.name(),
                dob: chance.birthday(),
                pob: chance.city()
            });
            
        const data = {
            title: chance.word(),
            released: chance.natural({ min: 1900, max: 2050 }),
            cast: [{
                role: chance.name(),
                actor: actor._id
            }]
        };

        const film = new Film(data);

        const errors = getErrors(film.validateSync(), 1);
        expect(errors.studio.properties.message).toEqual('Path `studio` is required.');
    });

    it('requires a released value', () => {
        
        const studio = new Studio(
            {
                name: chance.name(),
                address: {
                    city: chance.city(),
                    state: chance.state(),
                    country: chance.country({ full: true })
                }
            });

        const actor = new Actor(
            {
                name: chance.name(),
                dob: chance.birthday(),
                pob: chance.city()
            });

        const data = {
            title: chance.word(),
            studio: studio._id,
            cast: [{
                role: chance.name(),
                actor: actor._id
            }]
        };

        const film = new Film(data);

        const errors = getErrors(film.validateSync(), 1);
        expect(errors.released.properties.message).toEqual('Path `released` is required.');
    });

    it('requires a released value in the correct range', () => {
        
        const studio = new Studio(
            {
                name: chance.name(),
                address: {
                    city: chance.city(),
                    state: chance.state(),
                    country: chance.country({ full: true })
                }
            });
        
        const actor = new Actor(
            {
                name: chance.name(),
                dob: chance.birthday(),
                pob: chance.city()
            });
            
        const data = {
            title: chance.word(),
            studio: studio._id,
            released: chance.natural({ max: 1899 }),
            cast: [{
                role: chance.name(),
                actor: actor._id
            }]
        };

        const film = new Film(data);

        const errors = getErrors(film.validateSync(), 1);
        expect(errors.released.properties.message).toEqual(`Path \`released\` (${data.released}) is less than minimum allowed value (1900).`);
    });

    it('requires a cast', () => {
        
        const studio = new Studio(
            {
                name: chance.name(),
                address: {
                    city: chance.city(),
                    state: chance.state(),
                    country: chance.country({ full: true })
                }
            });
            
        const data = {
            title: chance.word(),
            studio: studio._id,
            released: chance.natural({ min: 1900, max: 2050 }),
            cast: [{ role: chance.name() }]
        };

        const film = new Film(data);

        const errors = getErrors(film.validateSync(), 1);
        expect(errors['cast.0.actor'].properties.message).toEqual('Path `actor` is required.');
    });


}); 
