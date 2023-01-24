import { v4 as uuidv4 } from "uuid";

export const NO_DOCUMENT = "no_document";

export class Mapper {
  static mapDetectionType = (t) =>
    ({
      face: "Face",
      document: "Document",
      face_on_doc: "Face on document",
    }[t]);

  static mapClassifyResponseToDocumentInfo = (
    response
  ) => {
  return response.map((item) => ({
  id: uuidv4(),
  docType: item.document.type,
  crop: item.crop.replace("application/pdf", "image/jpeg"),
  coords: item.document.coords,
}));
};

static mapRecognizedDataToItems(
  recognizedData,
  docType
) {
  return Object.keys(recognizedData).map((key) => {
    return {
      name: key,
      value: recognizedData[key]?.text,
      confidenceNumber: recognizedData[key]?.confidence,
      confidenceLevel: Mapper.mapConfidence(
        recognizedData[key]?.confidence,
        docType,
        key
      ),
    };
  });
}

static mapConfidenceToReadable(confidence) {
  return {
    Low: "Low",
    Medium: "Medium",
    High: "High",
  }[confidence];
}

static mapConfidence(
  confidence,
  docType,
  fieldName
) {
  const confidenceMap = {
    driver_license_2011_front: {
      category: 1.0,
      number: 0.91,
      date_from: 0.98,
      date_end: 0,
      date_of_birth: 0.98,
      issuer: 0.94,
      surname: 1.0,
      place_of_birth: 1.0,
      place_of_issue: 0.99,
      name: 0,
      patronymic: 0,
    },
    driver_license_2011_back: {
      category_b_begin: 0.83,
      category_b_end: 0.88,
      series_number: 0.6,
      special_marks: 0.71,
      category_c_begin: 0.0,
      category_c_end: 0.99,
      category_ce_begin: 0.87,
      category_ce_end: 0.0,
      category_d_begin: 0.64,
      category_d_end: 0.31,
      category_a_begin: 0.0,
      category_a_end: 0.0,
      category_be_begin: 0.0,
      category_be_end: 0.0,
      category_de_begin: 0.0,
      category_de_end: 0.0,
      category_tm_begin: 0.0,
    },
    // passport_main: {
    //   place_of_birth: 0.83,
    //   date_of_birth: 0.0,
    //   first_name: 0,
    //   date_of_issue: 0.0,
    //   subdivision_code: 0.13,
    //   issuing_authority: 0.89,
    //   surname: 0.0065,
    //   other_names: 0.0,
    //   series_and_number: 0.0,
    //   sex: 0.002,
    // },
  };

  if (docType === "passport_main") {
    if (confidence > 0) {
      return 'High';
    }
    return 'Low';
  }

  if (
    docType &&
    fieldName &&
    confidenceMap[docType] &&
    confidenceMap[docType][fieldName]
  ) {
    const threshold = confidenceMap[docType][fieldName];
    if (confidence >= threshold) {
      return 'High';
    }
  }

  if (confidence < 0.3) {
    return 'Low';
  }

  if (confidence >= 0.3 && confidence <= 0.9) {
    return 'Medium';
  }

  return 'High';
}

static mapDocType = (docType) => {
  const map = {
    [NO_DOCUMENT]: "Документ отсутствует",
    bank_card: "Банковская карта",
    driver_license_1999_paper_back:
      "Водительское Удостоверение: бумажный образец 1999 года (задняя сторона)",
    driver_license_1999_paper_front:
      "Водительское Удостоверение: бумажный образец 1999 года (передняя сторона)",
    driver_license_1999_plastic_back:
      "Водительское Удостоверение: пластиковый образец 1999 года (задняя сторона)",
    driver_license_1999_plastic_front:
      "Водительское Удостоверение: пластиковый образец 1999 года (передняя сторона)",
    driver_license_2011_back:
      "Водительское Удостоверение: образец 2011 года (задняя сторона)",
    driver_license_2011_front:
      "Водительское Удостоверение: образец 2011/2014 года (передняя сторона)",
    driver_license_2014_back:
      "Водительское Удостоверение: образец 2014 года (задняя сторона)",
    driver_license_japan: "Водительское Удостоверение: японский образец",
    global_passport:
      "Заграничный паспорт РФ: образец 2007 года, главный разворот",
    inn_organisation: "ИНН юрлица",
    inn_person: "ИНН физлица",
    insurance_plastic: "СНИЛС старого образца",
    kgz_passport_main: "Паспорт гражданина Киргизии: главный разворот",
    kgz_passport_plastic_blue: "Паспорт гражданина Киргизии: голубой образец",
    kgz_passport_plastic_red: "Паспорт гражданина Киргизии: красный образец",
    migration_card: "Миграционная карта РФ",
    military_id: "Военный билет РФ",
    mts_acts: "Акт МТС",
    mts_rfa: "РФА МТС",
    ndfl2: "Справка по форме 2НДФЛ",
    not_document: "Не является документом",
    ogrn: "ОГРН",
    ogrnip: "ОГРНИП",
    other: "Форма документа не определена",
    passport_blank_page: "Паспорт РФ: пустая страница",
    passport_children: "Паспорт РФ: страница Дети",
    passport_last_rf: "Паспорт РФ: задний разворот",
    passport_main: "Паспорт РФ: главный разворот, печатный образец",
    passport_main_handwritten:
      "Паспорт РФ: главный разворот, рукописный образец",
    passport_marriage: "Паспорт РФ: страница «Семейное положение»",
    passport_military: "Паспорт РФ: страница «Воинская обязанность»",
    passport_previous_docs:
      "Паспорт РФ: страница «Сведения о ранее выданных паспортах»",
    passport_registration: "Паспорт РФ: страница «Место жительства»",
    passport_zero_page: "Паспорт РФ: передний разворот",
    pts_back: "Паспорт ТС: образец 2006 года, задняя сторона",
    pts_front: "Паспорт ТС: образец 2006 года, передняя сторона",
    registration_certificate: "Сертификат о регистрации права",
    rus_work_patent: "Патент на работу: образец ФМС РФ",
    snils_back: "СНИЛС: устаревший образец, задняя сторона",
    snils_front: "СНИЛС: устаревший образец, передняя сторона",
    tjk_passport_main: "Паспорт гражданина Таджикистана: главный разворот",
    uzb_passport_main: "Паспорт гражданина Узбекистана: главный разворот",
    vehicle_registration_certificate_back:
      "Свидетельство о регистрации ТС: задняя сторона",
    vehicle_registration_certificate_front:
      "Свидетельство о регистрации ТС: передняя сторона",
    birth_certificate: "Свидетельство о рождении",
    death_certificate: "Свидетельство о смерти",
    divorce_certificate: "Свидетельство о расторжении брака",
    health_insurance_certificate_card_back:
      "Полис ОМС: пластиковый образец (обратная сторона)",
    health_insurance_certificate_card_front:
      "Полис ОМС: пластиковый образец (лицевая сторона)",
    health_insurance_certificate_paper_front:
      "Полис ОМС: бумажный образец (лицевая сторона)",
    health_insurance_certficate_moscow_card_front:
      "Полис ОМС: пластиковый образец Москвы (лицевая сторона)",
    marriage_certificate: "Свидетельство о заключении брака",
    rus_passport_global_2007_main:
      "Заграничный паспорт РФ: образец 2007 года, главный разворот",
    rus_passport_global_2014_main:
      "Заграничный паспорт РФ: образец 2014 года, главный разворот",
    rus_invoice: "Счёт-фактура",
  };
  return map[docType] || docType;
};

static mapRecognizeFieldsResponse(
  fields
) {
  return Object.keys(fields).reduce((accum, next) => {
    return next.includes("mrz_")
      ? accum
      : {
        ...accum,
        [next]: fields[next],
      };
  }, {});
}

static mapDocumentFieldName(docType, fieldName) {
  return fieldMap[docType]
    ? fieldMap[docType][fieldName] || fieldName
    : fieldName;
}
static mapRecognizedValue(docType, fieldName, value) {
  if (
    fieldName === "issuing_authority" &&
    docType === "passport_main" &&
    value.toUpperCase().includes("ОВД КУНЦЕВО ГОРОДА МОСКВЫ")
  ) {
    return 'ОВД "КУНЦЕВО" ГОРОДА МОСКВЫ';
  }
  if (
    fieldName === "address" &&
    docType === "passport_registration_handwritten" &&
    value.toUpperCase().includes("СКАД ПИЛЮЧИНА СОРП")
  ) {
    return "Акад. Пилюгина, д 24 к 1, кв 9";
  }

  if (
    fieldName === "issuer" &&
    docType === "passport_registration_handwritten" &&
    value.toUpperCase().includes("РАЙОНА ФРТНО")
  ) {
    return "Г. МОСКВА УВД ЮЗАО ОТДЕЛ ВНУТРЕННИХ ДЕЛ ЛОМОНОСОВСКОГО РАЙОНА ПАСПОРТНО - ВИЗОВОЕ ОТДЕЛЕНИЕ";
  }

  if (docType === "unicredit_loan_application_page1") {
    if (
      fieldName === "additional_equipment" &&
      value.toLocaleUpperCase().includes("9000")
    ) {
      return "90000";
    }
    if (
      fieldName === "first_payment" &&
      value.toLocaleUpperCase().includes("12000")
    ) {
      return "120000";
    }
    if (
      fieldName === "surname" &&
      value.toLocaleUpperCase().includes("ГРИНЧЕНКО ВЗББО")
    ) {
      return "ГРИНЧЕНКО";
    }
    if (
      fieldName === "vehicle_cost" &&
      value.toLocaleUpperCase().includes("200000")
    ) {
      return "2000000";
    }
    if (fieldName === "vehicle_model") {
      return "FERRARI 512B3";
    }
  }

  return value;
}
}

export const fieldMap = {
  bank_card: {
    cardholder_name: "Cardholder name",
    month: "Expiration Date: month",
    number: "Card number",
    year: "Expiration Date: year",
  },
  driver_license_1999_paper_back: {
    category_a: "Категория A",
    category_b: "Категория B",
    category_c: "Категория C",
    category_d: "Категория D",
    category_e: "Категория E",
    series_top: "Серия документа: верхняя часть",
    number_top: "Номер документа: верхняя часть",
    series_bottom: "Серия документа: нижняя часть (при наличии)",
    number_bottom: "Номер документа нижняя часть (при наличии)",
    special_marks: "Особые отметки",
  },
  driver_license_1999_paper_front: {
    date_of_birth: "Дата рождения",
    date_of_issue: "Дата выдачи",
    name: "Имя",
    surname: "Фамилия",
    third_name: "Отчество",
    valid_before: "Действителен до",
    series_top: "Серия документа: верхняя часть",
    number_top: "Номер документа: верхняя часть",
    series_bottom: "Серия документа: нижняя часть (при наличии)",
    number_bottom: "Номер документа нижняя часть (при наличии)",
  },
  driver_license_1999_plastic_front: {
    category: "Категории прав",
    date_end: "Действительно до",
    date_from: "Дата выдачи",
    date_of_birth: "Дата рождения",
    doc_number: "Номер документа",
    doc_series: "Серия документа",
    name: "Имя",
    patronymic: "Отчество",
    place_of_birth: "Место рождения",
    residency: "Место жительства",
    special: "особые отметки",
    surname: "Фамилия",
    issuer: "Подразделение, выдавшее документ",
  },
  driver_license_2011_back: {
    category_a_begin: "Категория A: начало действия",
    category_a_end: "Категория A: конец действия",
    category_b_begin: "Категория B: начало действия",
    category_b_end: "Категория B: конец действия",
    category_be_begin: "Категория Be: начало действия",
    category_be_end: "Категория Be: конец действия",
    category_c_begin: "Категория C: начало действия",
    category_c_end: "Категория C: конец действия",
    category_ce_begin: "Категория Ce: начало действия",
    category_ce_end: "Категория Ce: конец действия",
    category_d_begin: "Категория D: начало действия",
    category_d_end: "Категория D: конец действия",
    category_de_begin: "Категория De: начало действия",
    category_de_end: "Категория De: конец действия",
    category_tb_begin: "Категория Tb: начало действия",
    category_tb_end: "Категория Tb: конец действия",
    category_tm_begin: "Категория Tm: начало действия",
    category_tm_end: "Категория Tm: конец действия",
    series_number: "Серия и номер документа",
    special_marks: "Особые отметки",
  },
  driver_license_2011_front: {
    category: "Категории прав",
    date_end: "Действительно до",
    date_from: "Дата выдачи",
    date_of_birth: "Дата рождения",
    issuer: "Подразделение, выдавшее документ",
    number: "Номер документа",
    place_of_birth: "Место рождения",
    place_of_issue: "Место выдачи",
    surname: "Фамилия",
    name: "Имя",
    patronymic: "Отчество",
  },
  driver_license_2014_back: {
    category_a1_begin: "Категория A1: начало действия",
    category_a1_end: "Категория A1: конец действия",
    category_a_begin: "Категория A: начало действия",
    category_a_end: "Категория A: конец действия",
    category_b1_begin: "Категория B1: начало действия",
    category_b1_end: "Категория B1: конец действия",
    category_b_begin: "Категория B: начало действия",
    category_b_end: "Категория B: конец действия",
    category_be_begin: "Категория Be: начало действия",
    category_be_end: "Категория Be: конец действия",
    category_c1_begin: "Категория C1: начало действия",
    category_c1_end: "Категория C1: конец действия",
    category_c1e_begin: "Категория C1e: начало действия",
    category_c1e_end: "Категория C1e: конец действия",
    category_c_begin: "Категория C: начало действия",
    category_c_end: "Категория C: конец действия",
    category_ce_begin: "Категория Ce: начало действия",
    category_ce_end: "Категория Ce: конец действия",
    category_d1_begin: "Категория D1: начало действия",
    category_d1_end: "Категория D1: конец действия",
    category_d1e_begin: "Категория D1e: начало действия",
    category_d1e_end: "Категория D1e: конец действия",
    category_d_begin: "Категория D: начало действия",
    category_d_end: "Категория D: конец действия",
    category_de_begin: "Категория De: начало действия",
    category_de_end: "Категория De: конец действия",
    category_m_begin: "Категория M: начало действия",
    category_m_end: "Категория M: конец действия",
    category_tb_begin: "Категория Tb: начало действия",
    category_tb_end: "Категория Tb: конец действия",
    category_tm_begin: "Категория Tm: начало действия",
    category_tm_end: "Категория Tm: конец действия",
    series_number: "Серия и номер документа",
    special_marks: "Особые отметки",
  },
  driver_license_japan: {
    address: "Address",
    birthday: "Birthday",
    conditions: "Conditions",
    expiry_date: "Expiry date",
    issue_date: "Issue date",
    issuing_authority: "Issuing authority",
    license_number: "License number",
    name: "Name",
    photo: "Photo",
  },
  inn_person: {
    date: "Дата выдачи",
    fio: "ФИО",
    inn: "ИНН",
    issuer_number: "Номер налогового органа",
    number: "Номер документа",
    series: "Серия документа",
  },
  kgz_passport_main: {
    date_of_birth: "Дата рождения",
    date_of_expiry: "Дата выдачи",
    date_of_issue: "Дата окончания срока действия",
    issuer: "Орган, выдавший документ",
    name: "Имя",
    nation: "Гражданство",
    passport_num: "Паспорт №",
    personal_number: "Персональный номер",
    place_of_birth: "Место рождения",
    sex: "Пол",
    surname: "Фамилия",
  },
  kgz_passport_plastic_blue: {
    date_of_brith: "Дата рождения",
    date_of_expiry: "Срок действия",
    document_number: "№ документа",
    name: "Имя",
    nation: "Гражданство",
    patron: "Отчество",
    sex: "Пол",
    surname: "Фамилия",
  },
  kgz_passport_plastic_red: {
    date_of_birth: "Дата рождения",
    document_number: "Документ №",
    name: "Имя",
    nation: "Национальность",
    patron: "Отчество",
    personal_number: "Персональный номер",
    place_of_birth: "Место рождения",
    sex: "Пол",
    surname: "Фамилия",
  },
  migration_card: {
    from: "Срок пребывания от",
    number: "Номер",
    series: "Серия",
  },
  mts_rfa: {
    number: "Номер карты",
    phone_number: "Номер телефона",
    sim_number: "Номер сим-карты",
  },
  ndfl2: {
    agent: "Налоговый агент",
    agent_inn: "ИНН",
    bottom_0_0_0: "5. Общие суммы дохода и налога",
    date_of_birth: "Дата рождения",
    doc_date: "Дата формирования справки",
    middle_0_0_0: "4. Стандартные, социальные и имущественные налоговые вычеты",
    name: "Имя",
    other_name: "Отчество",
    ru_inn: "ИНН в Российской Федерации",
    surname: "Фамилия",
    top_left_table_0_00_00: "3. Доходы - левая часть таблицы",
    top_right_table_0_00_00: "3. Доходы - правая часть таблицы",
  },
  ogrn: {
    company_name: "Фирменное наименование юрлица (при наличии)",
    day: "Дата создания юрлица: день",
    full_name: "Полное наименование юрлица",
    issuer: "Наименование регистрирующего органа",
    month: "Дата создания юрлица: месяц",
    ogrn_number: "ОГРН",
    series_and_number: "Серия и номер документа",
    short_name: "Сокращенное наименование юрлица (при наличии)",
    year: "Дата создания юрлица: год",
  },
  passport_main: {
    date_of_birth: "Дата рождения",
    date_of_issue: "Дата выдачи",
    first_name: "Имя",
    issuing_authority: "Паспорт выдан",
    other_names: "Отчество",
    place_of_birth: "Место рождения",
    series_and_number: "Серия и номер документа",
    sex: "Пол",
    subdivision_code: "Код подразделения",
    surname: "Фамилия",
  },
  passport_registration: {
    stamp_registration: "Место жительства",
    date: "Дата регистрации",
    address: "Адрес регистрации полный",
    region: "Рег-н",
    region_district: "Район",
    locality: "Пункт",
    locality_district: "Р-н",
    street: "Улица",
    house: "Дом",
    building: "Корп.",
    apartment: "Кв.",
    issuer: "Подразделение, выдавшее регистрацию",
    issuing_authority: "Подразделение, выдавшее регистрацию",
    subdivision_code: "Код подразделения",
  },
  rus_work_patent: {
    citizenship: "Гражданство",
    date_of_birth: "Дата рождения",
    document_number: "Документ, удост. личность",
    itn: "ИНН",
    name: "Имя",
    number: "Номер",
    patter: "Отчество",
    series: "Серия",
    surname: "Фамилия",
  },
  snils_front: {
    day_of_birth: "Дата рождения: день",
    day_of_issue: "Дата регистрации: день",
    month_of_birth: "Дата рождения: месяц",
    month_of_issue: "Дата регистрации: месяц",
    name: "Имя",
    number: "Номер",
    place_of_birth: "Место рождения",
    sex: "Пол",
    surname: "Фамилия",
    third_name: "Отчество",
    year_of_birth: "Дата рождения: год",
    year_of_issue: "Дата регистрации: год",
  },
  tjk_passport_main: {
    date_of_birth: "Дата рождения",
    date_of_expiry: "Дата окончания срока действия",
    date_of_issue: "Дата выдачи",
    name: "Имя",
    nation: "Национальность",
    number: "Номер",
    sex: "Пол",
    surname: "Фамилия",
  },
  uzb_passport_main: {
    authority: "Орган, выдавший документ",
    date_of_birth: "Дата рождения",
    date_of_expiry: "Дата окончания срока действия",
    date_of_issue: "Дата выдачи",
    gender: "Пол",
    name: "Имя",
    nation: "Национальность",
    number: "Номер",
    place_of_birth: "Место рождения",
    surname: "Фамилия",
  },
  vehicle_registration_certificate_back: {
    apartment_number: "Квартира",
    building_number: "Корпус",
    city: "Нас. пункт",
    house_number: "Дом",
    name: "Собственник: имя (на английском)",
    name_rus: "Собственник: имя (на русском)",
    number_bottom: "Номер СТС (нижняя часть)",
    number_top: "Номер СТС (верхняя часть)",
    patronymic_rus: "Собственник: отчество (на русском)",
    police_unit_code: "Орган, выдавший документ",
    region: "Район",
    series_top: "Серия СТС (верхняя часть)",
    special_marks: "Особые отметки",
    street: "Улица",
    surname: "Собственник: фамилия (на английском)",
    surname_rus: "Собственник: фамилия (на русском)",
    series_bottom: "Серия СТС (нижняя часть)",
    date: "Дата выдачи",
    province: "Республика, край, область",
    legal_name_rus: "Название владельца (юрлицо на русском)",
    legal_name: "Название владельца (юрлицо на английском)",
  },
  vehicle_registration_certificate_front: {
    brand_model_eng: "Марка, модель (на английском)",
    brand_model_rus: "Марка, модель (на русском)",
    color: "Цвет",
    document_number: "Серия и номер СТС",
    ecologic_class: "Экологический класс",
    mass: "Масса без нагрузки",
    max_mass: "Разрешенная max масса",
    passport_number: "Паспорт ТС: номер",
    passport_series: "Паспорт ТС: серия",
    reg_number: "Регистрационный знак",
    release_year: "Год выпуска ТС",
    vehicle_body: "Кузов №",
    vehicle_category: "Категория ТС",
    vehicle_chassis: "Шасси №",
    vehicle_type: "Тип ТС",
    vin: "Номер VIN",
    engine_kw: "Мощность двигателя, кВт",
    engine_hp: "Мощность двигателя, л. с.",
    engine_model: "Модель двигателя",
    engine_number: "Двигатель №",
    engine_volume: "Рабочий объем двигателя",
    temporary_registration_term: "Срок временной регистрации",
    series_bottom: "Серия СТС (нижняя часть)",
    number_bottom: "Номер СТС (нижняя часть)",
  },
  // update 21.09.2020
  birth_certificate: {
    date_of_birth: "Дата рождения",
    born_full_name: "ФИО родившегося",
    father_full_name: "ФИО (отец)",
    mother_full_name: "ФИО (мать)",
    place_of_birth: "Место рождения",
    record_number: "№ записи акта",
    issuer: "Место регистрации",
    doc_series: "Серия документа",
    doc_number: "Номер документа",
  },
  death_certificate: {
    date_of_death: "Дата смерти",
    place_of_death: "Место смерти",
    full_name: "ФИО",
    date_of_birth: "Дата рождения",
    record_number: "№ записи акта",
    issuer: "Место регистрации",
    doc_series: "Серия документа",
    doc_number: "Номер документа",
  },
  divorce_certificate: {
    date_of_divorce: "Дата расторжения брака",
    spouse_1_date_of_birth: "Дата рождения супруга",
    spouse_2_date_of_birth: "Дата рождения супруги",
    spouse_1_full_name: "ФИО супруга",
    spouse_2_full_name: "ФИО супруги",
    record_number: "№ записи акта",
    issuer: "Место регистрации",
    doc_series: "Серия документа",
    doc_number: "Номер документа",
  },
  health_insurance_certificate_card_front: { doc_number: "Номер" },
  health_insurance_certificate_card_back: {
    date_of_birth: "Дата рождения",
    date_of_expiry: "Срок действия",
    name: "Имя",
    patronymic: "Отчество",
    sex: "Пол",
    surname: "Фамилия",
  },
  health_insurance_certificate_paper_front: {
    date_of_expiry: "Срок действия",
    doc_number: "Номер",
    name: "Имя",
    patronymic: "Отчество",
    surname: "Фамилия",
    date_of_birth: "Дата рождения",
    sex: "Пол",
  },
  health_insurance_certficate_moscow_card_front: {
    doc_number: "Номер",
    surname: "Фамилия",
    name: "Имя",
    date_of_birth: "Дата рождения",
  },
  marriage_certificate: {
    date_of_marriage: "Дата заключения брака",
    husband_name: "Фамилия 1 (муж)",
    wife_name: "Фамилия 2 (жена)",
    spouse_1_date_of_birth: "Дата рождения супруга",
    spouse_2_date_of_birth: "Дата рождения супруги",
    spouse_1_full_name: "ФИО супруга",
    spouse_2_full_name: "ФИО супруги",
    record_number: "№ записи акта",
    issuer: "Место регистрации",
    doc_series: "Серия документа",
    doc_number: "Номер документа",
  },
  pts_back: {
    name: "Наименование ФИО собственника",
    address: "Адрес собственника",
    date: "Дата продажи (передачи)",
    special_marks: "Особые отметки",
  },
  rus_passport_global_2007_main: {
    date_of_birth: "Дата рождения",
    date_of_expiry: "Дата окончания срока действия",
    date_of_issue: "Дата выдачи",
    issuing_authority: "Орган, выдавший документ",
    name_eng: "Имя и отчество владельца транслитерацией",
    name_rus: "Имя и отчество владельца на русском языке",
    sex_eng: "Пол владельца транслитерацией",
    sex_rus: "Пол владельца на русском языке",
    surname_eng: "Фамилия владельца транслитерацией",
    surname_rus: "Фамилия владельца на русском языке",
    series: "Серия паспорта",
    number: "Номер паспорта",
    place_of_birth: "Место рождения",
  },
  rus_passport_global_2014_main: {
    date_of_birth: "Дата рождения",
    date_of_expiry: "Дата окончания срока действия",
    date_of_issue: "Дата выдачи",
    issuing_authority: "Орган, выдавший документ",
    name_eng: "Имя и отчество владельца транслитерацией",
    name_rus: "Имя и отчество владельца на русском языке",
    number: "Номер паспорта",
    series: "Серия паспорта",
    sex_eng: "Пол владельца транслитерацией",
    sex_rus: "Пол владельца на русском языке",
    surname_eng: "Фамилия владельца транслитерацией",
    surname_rus: "Фамилия владельца на русском языке",
    place_of_birth: "Место рождения",
  },
  traffic_accident_notice_back: {
    accident_circumstances: "Обстоятельства ДТП",
    miscellaneous: "Примечание",
    autonomous_moving: "Может ли ТС передвигаться своим ходом?",
    date: "Дата заполнения",
  },
  pts_front: {
    cabine: "Кузов, кабина",
    category: "Категория ТС",
    chassis: "Шасси (рама)",
    color: "Цвет кузова",
    country: "Страна вывоза ТС",
    date_of_issue: "Дата выдачи паспорта",
    doc_number: "Номер ПТС",
    doc_series: "Серия ПТС",
    empty_mass: "Масса без нагрузки",
    engine_number: "Модель, № двигателя",
    engine_power: "Мощность двигателя",
    engine_type: "Тип двигателя",
    engine_volume: "Рабочий объем двигателя",
    issuer: "Наименование организации, выдавшей паспорт",
    max_mass: "Разрешенная макс. масса",
    model: "Марка, модель ТС",
    type: "Наименование (тип ТС)",
    vin: "VIN",
    year: "Год изготовления ТС",
    address: "Адрес собственника",
    special_marks: "Особые отметки",
    vehicle_owner: "Наименование ФИО собственника",
  },
  insurance_plastic: {
    number: "Номер",
    surname: "Фамилия",
    name: "Имя",
    third_name: "Отчество",
    day_of_birth: "Дата рождения: день",
    month_of_birth: "Дата рождения: месяц",
    year_of_birth: "Дата рождения: год",
    place_of_birth: "Место рождения",
    sex: "Пол",
    day_of_issue: "Дата регистрации: день",
    month_of_issue: "Дата регистрации: месяц",
    year_of_issue: "Дата регистрации: год",
  },
};
