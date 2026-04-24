# Books API Dokumentatsioon
Antud API võimaldab hallata raamatuid, autoreid, žanreid ja arvustusi. Andmebaasina on kasutusel PostgreSQL (Supabase) ja ORM-ina Prisma.

## Paigaldamine ja käivitamine

Andmebaasi seadistamine: Lisa .env faili oma DATABASE_URL.

Andmete sünkroniseerimine: npx prisma migrate dev

Testandmete sisestamine (15 raamatut, 6 autorit): npx prisma db seed

Serveri käivitamine: npm run dev

## Endpointid

1. GET /api/v1/books

Tagastab lehekülgedeks jagatud nimekirja raamatutest koos autorite ja žanritega.

Query parameetrid:

page (vaikimisi 1) - Lehekülje number.

limit (vaikimisi 10) - Raamatute arv lehel.

search - Otsing pealkirja või ISBN järgi.

sortBy - Sorteerimisväli (nt title, publishedYear).

order - Sorteerimise suund (asc või desc).

Näidisvastus (200 OK):

```
{
  "data": [
    {
      "id": 1,
      "title": "Tõde ja Õigus I",
      "isbn": "9789949444123",
      "author": { "firstName": "Anton Hansen", "lastName": "Tammsaare" },
      "genres": [{ "name": "Klassika" }]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 15
  }
}
```
2. GET /api/v1/books/:id

Tagastab ühe konkreetse raamatu täisandmed koos arvustustega.

Võimalikud vead: 404 Not Found (kui ID-d pole).

3. GET /api/v1/books/:id/average-rating

Arvutab raamatu keskmise hinde kõigi arvustuste põhjal.

Näidisvastus (200 OK):

```
{
  "bookId": 1,
  "averageRating": 4.5,
  "reviewCount": 10
}
```
4. POST /api/v1/books

Lisab uue raamatu süsteemi.

Request Body:

```
{
  "title": "Kevade",
  "isbn": "9789985011001",
  "publishedYear": 1912,
  "language": "Estonian",
  "authorId": 3,
  "publisherId": 1,
  "genreIds": [1, 2]
}
```
Vead: 400 Bad Request (valideerimise viga), 409 Conflict (ISBN juba olemas).

5. PATCH /api/v1/books/:id

Uuendab osaliselt raamatu andmeid.

6. DELETE /api/v1/books/:id

Eemaldab raamatu süsteemist.

Vastus: 204 No Content

## Veateated

API kasutab standardseid HTTP staatuskoode:

400 - Vigased andmed (Zod valideerimine ebaõnnestus).

401 - Autoriseerimine puudub (kui lisate auth-i).

404 - Ressurssi ei leitud.

409 - Konflikt (nt duplikaat ISBN).

500 - Serveri viga.