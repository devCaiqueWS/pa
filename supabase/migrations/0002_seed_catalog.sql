-- =============================================================================
-- Seed do catálogo — mesmos dados de lib/catalog.ts.
-- Rode DEPOIS de 0001_init.sql. Idempotente (on conflict do nothing).
-- =============================================================================

insert into public.categories (slug, name, tagline, image, position) values
  ('perfumaria',     'Perfumaria',       'Uma fragrância para cada presença.',          '/assets/img/body-splash.jpg',              1),
  ('cuidado-facial', 'Cuidado Facial',   'Seu cuidado, no seu tempo.',                  '/assets/img/teaser-radicaline-poster.jpg', 2),
  ('corpo-banho',    'Corpo & Banho',    'Frescor e perfume para todos os dias.',       '/assets/img/banhos-aromaticos.jpg',        3),
  ('desodorantes',   'Desodorantes',     'O clássico que atravessa gerações.',          '/assets/img/desodorante-original.jpg',     4),
  ('cabelos',        'Cabelos',          'Cuidado completo, da raiz às pontas.',        '/assets/img/teaser-shampoo.jpg',           5),
  ('casa',           'Casa',             'A Pierre que perfuma o seu lar.',             '/assets/img/maison-sacola.jpg',            6),
  ('kits',           'Kits & Presentes', 'Combinações para usar, vender e presentear.', '/assets/img/bag-colorida.jpg',             7)
on conflict (slug) do nothing;

insert into public.subcategories (category_id, slug, name, position)
select c.id, v.slug, v.name, v.position
from (values
  ('perfumaria','deo-colonia','Deo Colônia',1),
  ('perfumaria','body-splash','Body Splash',2),
  ('perfumaria','aguas-virtuosas','Águas Virtuosas',3),
  ('perfumaria','femininos','Femininos',4),
  ('perfumaria','masculinos','Masculinos',5),
  ('cuidado-facial','radicaline','Radicaline',1),
  ('cuidado-facial','limpeza','Limpeza',2),
  ('cuidado-facial','hidratacao','Hidratação',3),
  ('cuidado-facial','cuidados-especiais','Cuidados Especiais',4),
  ('corpo-banho','hidratantes','Hidratantes',1),
  ('corpo-banho','banho-aromatico','Banho Aromático',2),
  ('corpo-banho','sabonetes','Sabonetes',3),
  ('corpo-banho','body-splash','Body Splash',4),
  ('desodorantes','original','O Original',1),
  ('desodorantes','roll-on','Roll-on',2),
  ('desodorantes','aerossol','Aerossol & Pump',3),
  ('desodorantes','combos','Combos',4),
  ('cabelos','shampoo','Shampoo',1),
  ('cabelos','condicionador','Condicionador',2),
  ('cabelos','tratamento','Tratamento',3),
  ('casa','ambientes','Ambientes',1),
  ('casa','tecidos','Tecidos',2),
  ('kits','por-ocasiao','Por ocasião',1),
  ('kits','mais-vendidos','Mais vendidos',2)
) as v(cat_slug, slug, name, position)
join public.categories c on c.slug = v.cat_slug
on conflict (category_id, slug) do nothing;

insert into public.products
  (slug, name, category_id, subcategory_id, line, gender, family, short_desc, image, badges, featured, is_new, position)
select
  v.slug, v.name, c.id, s.id,
  nullif(v.line,''), nullif(v.gender,''), nullif(v.family,''),
  v.short_desc, v.image, v.badges, v.featured, v.is_new, v.position
from (values
  ('deo-colonia-laura','Deo Colônia Laura Um','perfumaria','deo-colonia','Laura','feminino','Floral elegante','Floral marcante e sofisticado, para presença feminina inesquecível.','/assets/img/deo-colonias-laura.jpg', array['Mais vendido'], true,  false, 1),
  ('deo-colonia-aura-unica','Deo Colônia Aura Única','perfumaria','deo-colonia','','feminino','Floral','A assinatura olfativa para quem tem uma aura só sua.','/assets/img/deo-colonias-laura.jpg', array[]::text[], true,  false, 2),
  ('secrets-black','Secrets Black','perfumaria','femininos','Secrets','feminino','Floral amadeirado','Intenso e envolvente, para a noite e os momentos marcantes.','/assets/img/fragrancia-secrets.jpg', array['Mais vendido'], true,  false, 3),
  ('secrets-pour-homme','Secrets Pour Homme','perfumaria','masculinos','Secrets','masculino','Amadeirado masculino','Sofisticação masculina com a sedução da linha Secrets.','/assets/img/fragrancia-secrets.jpg', array[]::text[], true,  false, 4),
  ('body-splash-jabuticaba','Body Splash Jabuticaba','perfumaria','body-splash','','feminino','Frutal brasileira','Memória frutal brasileira em uma bruma leve e refrescante.','/assets/img/body-splash.jpg', array[]::text[], false, true,  5),
  ('body-splash-vert','Body Splash Vert','perfumaria','body-splash','','unissex','Fresca e verde','Frescor cítrico e verde para o dia a dia, de uso livre.','/assets/img/body-splash.jpg', array[]::text[], false, false, 6),
  ('radicaline-sabonete','Radicaline Sabonete Facial','cuidado-facial','radicaline','Radicaline','','','A nova era do cuidado facial Pierre começa pela limpeza.','/assets/img/teaser-radicaline-poster.jpg', array['Em breve'], true,  true,  1),
  ('radicaline-serum','Radicaline Sérum','cuidado-facial','radicaline','Radicaline','','','Cuidado intensivo dia e noite para uma pele revitalizada.','/assets/img/teaser-radicaline.jpg', array['Em breve'], false, true,  2),
  ('agua-micelar','Água Micelar Pierre','cuidado-facial','limpeza','','','','Limpa, remove maquiagem e prepara a pele em um só passo.','/assets/img/teaser-radicaline-poster.jpg', array[]::text[], true,  false, 3),
  ('creme-aloe-vera','Creme Facial Aloe Vera','cuidado-facial','hidratacao','Aloe Vera','','','Hidratação, frescor e cuidado versátil para todos os tipos de pele.','/assets/img/teaser-protetor.jpg', array[]::text[], false, false, 4),
  ('creme-rosa-mosqueta','Creme Facial Rosa Mosqueta','cuidado-facial','cuidados-especiais','Rosa Mosqueta','','','Nutrição e reparação para um cuidado especial da pele.','/assets/img/teaser-protetor.jpg', array[]::text[], false, false, 5),
  ('banho-aromatico-lavande','Banho Aromático Lavande','corpo-banho','banho-aromatico','','','Floral relaxante','O perfume da lavanda transforma o banho em um ritual de calma.','/assets/img/banhos-aromaticos.jpg', array[]::text[], true,  false, 1),
  ('banho-aromatico-dazur','Banho Aromático D’Azur','corpo-banho','banho-aromatico','','','Fresca aquática','Frescor aquático para começar ou encerrar o dia com leveza.','/assets/img/banhos-aromaticos.jpg', array[]::text[], false, false, 2),
  ('hidratante-corporal','Hidratante Corporal Pierre','corpo-banho','hidratantes','','','','Maciez e perfume que permanecem na pele o dia inteiro.','/assets/img/banhos-aromaticos.jpg', array[]::text[], true,  false, 3),
  ('creme-original','Desodorante Creme Original','desodorantes','original','O Original','','','O desodorante em creme que atravessa gerações. O inigualável Pierre.','/assets/img/desodorante-original.jpg', array['Mais vendido'], true,  false, 1),
  ('creme-bloqueador','Creme Bloqueador de Odores','desodorantes','original','O Original','','','A confiança do Original, reforçada para proteção intensa.','/assets/img/desodorantes-varios.jpg', array[]::text[], true,  false, 2),
  ('roll-on-cinza','Roll-on Cinza','desodorantes','roll-on','','','','Proteção prática e suave para a rotina. Um dos mais procurados.','/assets/img/desodorantes-varios.jpg', array['TOP 2'], false, false, 3),
  ('roll-on-toque-seco','Roll-on Toque Seco','desodorantes','roll-on','','','','Sensação seca imediata e proteção de longa duração.','/assets/img/desodorantes-varios.jpg', array[]::text[], false, false, 4),
  ('shampoo-pierre','Shampoo Pierre','cabelos','shampoo','','','','Limpeza suave que respeita o equilíbrio dos fios.','/assets/img/teaser-shampoo.jpg', array['Em breve'], false, true,  1),
  ('condicionador-pierre','Condicionador Pierre','cabelos','condicionador','','','','Maciez, brilho e fácil de pentear, do comprimento às pontas.','/assets/img/teaser-shampoo.jpg', array['Em breve'], false, true,  2),
  ('aromatizador-ambiente','Aromatizador de Ambiente','casa','ambientes','Maison','','','Deixe a casa acolhedora com a assinatura olfativa Pierre.','/assets/img/maison-sacola.jpg', array[]::text[], true,  false, 1),
  ('agua-rouparia','Água de Rouparia','casa','tecidos','Maison','','','Perfume suave para lençóis, toalhas, roupas e armários.','/assets/img/maison-sacola.jpg', array[]::text[], false, false, 2),
  ('kit-original','Kit Original','kits','mais-vendidos','','','','Desodorantes e variações para recompra. O presente certeiro.','/assets/img/bag-colorida.jpg', array['Mais vendido'], true,  false, 1),
  ('kit-fragrancias','Kit Fragrâncias','kits','por-ocasiao','','','','Body splash, deo colônia e presença marcante em um só presente.','/assets/img/bag-colorida.jpg', array[]::text[], true,  false, 2),
  ('kit-primeira-compra','Kit Primeira Compra','kits','por-ocasiao','','','','A porta de entrada perfeita para conhecer a marca Pierre.','/assets/img/bag-colorida.jpg', array[]::text[], false, false, 3)
) as v(slug,name,cat_slug,sub_slug,line,gender,family,short_desc,image,badges,featured,is_new,position)
join public.categories c on c.slug = v.cat_slug
left join public.subcategories s on s.category_id = c.id and s.slug = v.sub_slug
on conflict (slug) do nothing;
