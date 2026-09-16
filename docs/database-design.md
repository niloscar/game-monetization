## Tankar bakom databasstrukturen

Databasstrukturen separerar information med olika ansvar och livslängd. Syftet är att bevara historik och göra systemet enkelt att vidareutveckla.

**Användare och kunder** lagras separat eftersom alla användare inte är kunder. `users` hanterar användarkonton och autentisering, medan `customers` innehåller kunduppgifter. Därmed kan exempelvis namn ändras utan att användaridentiteten påverkas.

**Ordrar och orderadresser** lagras separat för att bevara adressen vid köptillfället, även om kunden senare flyttar. `orders` innehåller även status och tidpunkter för att skilja på skapade och betalda ordrar. Endast betalda köp ska ge tillgång till innehåll.

**Orderrader och priser** hanteras i `order_items` respektive `prices`. Orderraderna möjliggör flera produkter per order och sparar priset vid köptillfället (`unit_price`). Den separata pristabellen möjliggör prishistorik utan att tidigare köp påverkas.

**Produkter, features och power-ups** är separerade för att tjänstepaketens innehåll ska kunna förändras utan att tabellstrukturen behöver ändras. `products` innehåller tjänstepaketen, `features` innehåller egenskaper som reklamfrihet och scoreboard, medan `power_ups` innehåller spelrelaterade uppgraderingar. Kopplingstabellerna `product_features` och `product_power_ups` möjliggör many-to-many-relationer. Power-ups är inte förbrukningsbara, utan låses upp genom köp.

**Spelresultat** lagras i `scores` tillsammans med en referens till det paket användaren hade när poängen registrerades. Detta bevarar vilken nivå resultatet uppnåddes med, även om användaren senare byter paket.

**Roller och betalningsmetoder** lagras separat i `roles` och `payment_methods`. Det minskar duplicering och gör det möjligt att lägga till nya alternativ utan att ändra användar- eller ordertabellernas struktur.

**Soft delete och avaktivering** används för att kunna dölja eller avveckla exempelvis användare, produkter och spelinnehåll utan att förstöra historiska referenser. Produkter kan även tas ur försäljning utan att tidigare köpare förlorar åtkomsten.

Sammantaget ger strukturen en tydlig ansvarsfördelning, bevarad historik och möjlighet att bygga ut systemet utan omfattande databasändringar.
