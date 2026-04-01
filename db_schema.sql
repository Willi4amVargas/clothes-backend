CREATE TABLE public.clients (
    code character varying NOT NULL,
    description character varying,
    address character varying,
    client_id character varying,
    email character varying,
    phone character varying,
    contact character varying,
    country character varying,
    province character varying,
    city character varying,
    town character varying,
    credit_days integer,
    credit_limit double precision,
    discount double precision
);

CREATE TABLE public.inventory_operation (
    correlative integer NOT NULL,
    operation_type character varying,
    document_no character varying,
    emission_date date,
    description character varying,
    total double precision DEFAULT 0,
    total_net double precision DEFAULT 0,
    total_tax double precision DEFAULT 0,
    user_code character varying DEFAULT '00'::character varying,
    total_details integer DEFAULT 0,
    total_amount double precision DEFAULT 0
);

CREATE TABLE public.inventory_operation_details (
    main_correlative integer NOT NULL,
    line integer NOT NULL,
    code_product character varying,
    description_product character varying,
    referenc character varying,
    mark character varying,
    model character varying,
    amount double precision,
    unit integer,
    unitary_cost double precision,
    aliquot double precision,
    total_cost double precision DEFAULT 0,
    total_tax double precision DEFAULT 0,
    total double precision DEFAULT 0
);

CREATE TABLE public.products (
    code character varying NOT NULL,
    description character varying,
    short_name character varying,
    mark character varying,
    model character varying,
    referenc character varying,
    discount double precision,
    status boolean,
    origin character varying,
    buy_tax double precision,
    sale_tax double precision
);

CREATE TABLE public.products_stock (
    product_code character varying NOT NULL,
    unit integer,
    stock double precision
);

CREATE TABLE public.products_units (
    correlative integer NOT NULL,
    unit character varying,
    product_code character varying,
    main_unit boolean,
    cost double precision,
    price double precision
);

CREATE TABLE public.profile (
    code character varying NOT NULL,
    description character varying
);

CREATE TABLE public.sales_operation (
    correlative integer NOT NULL,
    operation_type character varying,
    document_no character varying,
    control_no character varying,
    emission_date date,
    client_code character varying,
    client_name character varying,
    client_id character varying,
    client_address character varying,
    client_phone character varying,
    seller character varying,
    credit_days integer,
    description character varying,
    user_code character varying DEFAULT '00'::character varying,
    total_amount double precision DEFAULT 0,
    total_net_details double precision DEFAULT 0,
    total_tax_details double precision DEFAULT 0,
    total_details double precision DEFAULT 0,
    percent_discount double precision DEFAULT 0,
    discount double precision DEFAULT 0,
    total_net double precision DEFAULT 0,
    total_exempt double precision DEFAULT 0,
    total_tax double precision DEFAULT 0,
    total double precision DEFAULT 0,
    credit double precision DEFAULT 0,
    cash double precision DEFAULT 0,
    total_net_cost double precision DEFAULT 0,
    total_tax_cost double precision DEFAULT 0,
    total_cost double precision DEFAULT 0,
    total_count_details double precision DEFAULT 0,
    pending boolean
);

CREATE TABLE public.shopping_operation (
    correlative integer NOT NULL,
    operation_type character varying,
    document_no character varying,
    control_no character varying,
    emission_date date,
    provider_code character varying,
    provider_name character varying,
    provider_id character varying,
    provider_address character varying,
    provider_phone character varying,
    credit_days integer,
    expiration_date date,
    description character varying,
    user_code character varying DEFAULT '00'::character varying,
    total_amount double precision DEFAULT 0,
    total_net_details double precision DEFAULT 0,
    total_tax_details double precision DEFAULT 0,
    total_details double precision DEFAULT 0,
    percent_discount double precision DEFAULT 0,
    discount double precision DEFAULT 0,
    total_net double precision DEFAULT 0,
    total_tax double precision DEFAULT 0,
    total double precision DEFAULT 0,
    credit double precision DEFAULT 0,
    cash double precision DEFAULT 0,
    total_count_details double precision DEFAULT 0,
    total_operation double precision DEFAULT 0,
    total_exempt double precision DEFAULT 0
);

CREATE TABLE public.sales_operation_details (
    main_correlative integer NOT NULL,
    line integer NOT NULL,
    code_product character varying,
    description_product character varying,
    referenc character varying,
    mark character varying,
    model character varying,
    amount double precision,
    unit integer,
    unitary_cost double precision,
    sale_aliquot double precision,
    buy_aliquot double precision,
    price double precision DEFAULT 0,
    total_net_cost double precision DEFAULT 0,
    total_tax_cost double precision DEFAULT 0,
    total_cost double precision DEFAULT 0,
    percent_discount double precision DEFAULT 0,
    discount double precision DEFAULT 0,
    total_net double precision DEFAULT 0,
    total_tax double precision DEFAULT 0,
    total double precision DEFAULT 0
);

CREATE TABLE public.shopping_operation_details (
    main_correlative integer NOT NULL,
    line integer NOT NULL,
    code_product character varying,
    description_product character varying,
    referenc character varying,
    mark character varying,
    model character varying,
    amount double precision,
    unit integer,
    unitary_cost double precision,
    percent_discount double precision DEFAULT 0,
    discount double precision DEFAULT 0,
    total_net double precision DEFAULT 0,
    total_tax double precision DEFAULT 0,
    total double precision DEFAULT 0,
    buy_aliquot double precision
);

CREATE TABLE public.users (
    code character varying NOT NULL,
    description character varying,
    email character varying,
    profile character varying,
    password character varying,
    status boolean
);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (code);

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (code);

ALTER TABLE ONLY public.inventory_operation_details
    ADD CONSTRAINT inventory_operation_details_line_key UNIQUE (line);

ALTER TABLE ONLY public.inventory_operation_details
    ADD CONSTRAINT inventory_operation_details_pkey PRIMARY KEY (main_correlative, line);

ALTER TABLE ONLY public.inventory_operation
    ADD CONSTRAINT inventory_operation_pkey PRIMARY KEY (correlative);

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (code);

ALTER TABLE ONLY public.products_stock
    ADD CONSTRAINT products_stock_pkey PRIMARY KEY (product_code, unit);

ALTER TABLE ONLY public.products_units
    ADD CONSTRAINT products_units_pkey PRIMARY KEY (correlative);

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (code);

ALTER TABLE ONLY public.sales_operation_details
    ADD CONSTRAINT sales_operation_details_line_key UNIQUE (line);

ALTER TABLE ONLY public.sales_operation_details
    ADD CONSTRAINT sales_operation_details_pkey PRIMARY KEY (main_correlative, line);

ALTER TABLE ONLY public.sales_operation
    ADD CONSTRAINT sales_operation_pkey PRIMARY KEY (correlative);

ALTER TABLE ONLY public.shopping_operation
    ADD CONSTRAINT shopping_operation_pkey PRIMARY KEY (correlative);

ALTER TABLE ONLY public.shopping_operation
    ADD CONSTRAINT shopping_operation_user_code_fkey FOREIGN KEY (user_code) REFERENCES public.users(code) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.shopping_operation_details
    ADD CONSTRAINT shopping_operation_details_line_key UNIQUE (line);

ALTER TABLE ONLY public.shopping_operation_details
    ADD CONSTRAINT shopping_operation_details_pkey PRIMARY KEY (main_correlative, line);

ALTER TABLE ONLY public.inventory_operation_details
    ADD CONSTRAINT inventory_operation_details_code_product_fkey FOREIGN KEY (code_product) REFERENCES public.products(code) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.inventory_operation_details
    ADD CONSTRAINT inventory_operation_details_main_correlative_fkey FOREIGN KEY (main_correlative) REFERENCES public.inventory_operation(correlative) ON UPDATE CASCADE ON DELETE CASCADE;


ALTER TABLE ONLY public.inventory_operation_details
    ADD CONSTRAINT inventory_operation_details_unit_fkey FOREIGN KEY (unit) REFERENCES public.products_units(correlative) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.inventory_operation
    ADD CONSTRAINT inventory_operation_user_code_fkey FOREIGN KEY (user_code) REFERENCES public.users(code) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.products_stock
    ADD CONSTRAINT products_stock_product_code_fkey FOREIGN KEY (product_code) REFERENCES public.products(code) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.products_stock
    ADD CONSTRAINT products_stock_product_unit_fkey FOREIGN KEY (unit) REFERENCES public.products_units(correlative) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.products_units
    ADD CONSTRAINT products_units_product_code_fkey FOREIGN KEY (product_code) REFERENCES public.products(code) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.sales_operation
    ADD CONSTRAINT sales_operation_client_code_fkey FOREIGN KEY (client_code) REFERENCES public.clients(code) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.sales_operation_details
    ADD CONSTRAINT sales_operation_details_code_product_fkey FOREIGN KEY (code_product) REFERENCES public.products(code) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.sales_operation_details
    ADD CONSTRAINT sales_operation_details_main_correlative_fkey FOREIGN KEY (main_correlative) REFERENCES public.sales_operation(correlative) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.sales_operation_details
    ADD CONSTRAINT sales_operation_details_unit_fkey FOREIGN KEY (unit) REFERENCES public.products_units(correlative) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.sales_operation
    ADD CONSTRAINT sales_operation_user_code_fkey FOREIGN KEY (user_code) REFERENCES public.users(code) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.shopping_operation_details
    ADD CONSTRAINT shopping_operation_details_code_product_fkey FOREIGN KEY (code_product) REFERENCES public.products(code) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.shopping_operation_details
    ADD CONSTRAINT shopping_operation_details_main_correlative_fkey FOREIGN KEY (main_correlative) REFERENCES public.shopping_operation(correlative) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.shopping_operation_details
    ADD CONSTRAINT shopping_operation_details_unit_fkey FOREIGN KEY (unit) REFERENCES public.products_units(correlative) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_profile_fkey FOREIGN KEY (profile) REFERENCES public.profile(code) ON UPDATE CASCADE ON DELETE RESTRICT;
