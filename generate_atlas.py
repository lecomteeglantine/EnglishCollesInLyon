#!/usr/bin/env python3
"""
generate_atlas.py — fabrique les Colle Atlas par pays à partir des dossiers
de civilisation (.md) et du moteur (l'atlas US).

Usage : python3 generate_atlas.py <dossier_md> <moteur_us.html> <sortie>
"""
import re, json, sys, os

# ---------------------------------------------------------------- config pays
COUNTRIES = {
    '1': dict(code='gb', name='United Kingdom',   the='the United Kingdom', news='Fresh from the UK',
              subview='The four nations', subhero='One state, four nations',
              subsub='Tap a nation: essential facts, the key debate, a colle question and its connections.'),
    '2': dict(code='us', name='United States',    the='the United States', news='Fresh from the US',
              subview='The four regions', subhero='One nation, four Americas',
              subsub='Tap a region: essential facts, the key debate, a colle question and its connections.'),
    '3': dict(code='ie', name='Ireland',          the='Ireland', news='Fresh from Ireland'),
    '4': dict(code='ca', name='Canada',           the='Canada', news='Fresh from Canada'),
    '5': dict(code='au', name='Australia',        the='Australia', news='Fresh from Australia'),
    '6': dict(code='nz', name='New Zealand',      the='New Zealand', news='Fresh from New Zealand'),
    '7': dict(code='in', name='India',            the='India', news='Fresh from India'),
    '8': dict(code='za', name='South Africa',     the='South Africa', news='Fresh from South Africa'),
}
PARADOX_VIEW = dict(subview='The great paradoxes', subhero='Where the best questions are born',
                    subsub='Tap a paradox: name the tension precisely — that is where a problematic starts.')

PALETTE = ["#B23A2E", "#6A4C93", "#8A5A2B", "#3F7A4B", "#1F3A5F", "#2C7A7B", "#A86E18", "#0072CE", "#B0791A"]

ILL_KEYWORDS = [
    (r'election|vote|democracy|electoral', 'ballot'),
    (r'court|constitution|law|justice|right|treaty|apartheid|partition', 'scales'),
    (r'monarch|crown|king|queen|commonwealth', 'crown'),
    (r'religion|church|secular|catholic|faith', 'chapel'),
    (r'health|care|welfare', 'heart'),
    (r'world|foreign|power|global|geopolit|neutral', 'globe'),
    (r'immigr|dream|identity|multicultural|diaspora|emigr', 'liberty'),
    (r'gun|arms|security|defence|defense', 'shield'),
    (r'environment|climate|land|outback|nature', 'leaf'),
    (r'econom|inequal|tiger|tax|mining|trade', 'scroll'),
    (r'indigenous|maori|aborig|first nations|native|famine|language', 'generic'),
]

# ---------------------------------------------------------------- helpers
def clean(s):
    s = re.sub(r'\*\*(.+?)\*\*', r'\1', s)
    s = re.sub(r'\*(.+?)\*', r'\1', s)
    s = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', s)
    s = s.replace('"', '\u201c').replace('  ', ' ')
    return re.sub(r'\s+', ' ', s).strip()

def sent(s):
    s = clean(s).strip(' .;')
    return (s[0].upper() + s[1:] + '.') if s else s

def first_quote(s):
    m = re.search(r'[\u201c"]([^\u201c\u201d"]+)[\u201d"]', s)
    return clean(m.group(1)) if m else clean(s)

def pick_ill(title):
    t = title.lower()
    for pat, ill in ILL_KEYWORDS:
        if re.search(pat, t):
            return ill
    return 'generic'

def field(card, emoji):
    m = re.search(r'- \*\*' + re.escape(emoji) + r'[^:*]*:?\*\*:?\s*(.+)', card)
    return m.group(1).strip() if m else ''

# ---------------------------------------------------------------- parsing
def parse_dossier(path):
    md = open(path, encoding='utf-8').read()
    num = re.search(r'civilisation-(\d)', os.path.basename(path)).group(1)
    C = dict(COUNTRIES[num])
    if 'subview' not in C:
        C.update(PARADOX_VIEW)
    C['num'] = num

    # --- faits essentiels + idée clé
    ef_block = re.search(r'## 1\. ESSENTIAL FACTS\n([\s\S]*?)\n---', md)
    ef = [clean(l[2:]) for l in ef_block.group(1).split('\n') if l.startswith('- ')] if ef_block else []
    key_m = re.search(r'> [⚠💡�️]*\s*\*\*Key idea:?\*\*:?\s*(.+)', md)
    key_idea = clean(key_m.group(1)) if key_m else ''

    # --- fiches thématiques
    cards_zone = md[md.index('Theme-by-theme colle cards'):]
    raw_cards = re.split(r'\n### \d+\. ', cards_zone)[1:]
    cards = []
    for rc in raw_cards:
        title = clean(rc.split('\n', 1)[0])
        c = dict(title=title, body=rc)
        s30 = field(rc, '⏱️')
        c['sentence'] = first_quote(s30.split('Enriched')[0])
        enr = s30.split('Enriched:**')
        c['enriched'] = first_quote(enr[1]) if len(enr) > 1 else ''
        mk = field(rc, '✅').split('❌')[0]
        c['must'] = [sent(x) for x in re.split(r';|(?<=\))\.', clean(mk)) if clean(x).strip(' .')][:5]
        c['trap'] = clean(field(rc, '⚠️'))
        press = field(rc, '📰')
        pm = re.search(r'documents? on (.+?)\.', press, re.I)
        c['contexts'] = [clean(x) for x in (pm.group(1).split(',') if pm else [])][:4]
        wm = re.search(r'because of \*\*(.+?)\*\*', press)
        c['presswhy'] = clean(wm.group(1)) if wm else ''
        c['tags'] = [clean(x) for x in field(rc, '🔄').split(',') if clean(x)][:6]
        hook = field(rc, '🎣')
        soph = hook.split('sophisticated')
        c['hook'] = first_quote(soph[1] if len(soph) > 1 else hook)
        c['openings'] = [clean(x) for x in field(rc, '🚪').split('·') if clean(x)][:3]
        c['words'] = [clean(x) for x in field(rc, '🔑').split(',') if clean(x)]
        c['stakes'] = clean(field(rc, '🎭'))
        c['paradox'] = sent(field(rc, '♻️'))
        c['compare'] = clean(field(rc, '🌍')).rstrip('.')
        c['refs'] = clean(field(rc, '📖')).rstrip('.')
        model = field(rc, '✍️')
        good = re.search(r'✅\s*\*?(.+)$', model)
        c['model'] = first_quote(good.group(1)) if good else ''
        c['frtrap'] = clean(field(rc, '🇫🇷'))
        c['questions'] = [clean(x).rstrip('.') + '?' if not clean(x).endswith('?') else clean(x)
                          for x in first_quote(field(rc, '❓')).split('·') if clean(x)]
        plan = field(rc, '📝')
        pt = re.search(r'\(\s*[\u201c"](.+?)[\u201d"]\s*\)', plan)
        c['plantitle'] = clean(pt.group(1)) if pt else ''
        pp = re.search(r':\*\*\s*(.+)$', plan) or re.search(r'\)\s*:?\s*(I\..+)$', plan)
        parts = re.split(r'\s*—\s*(?=I{1,3}\.)', clean(pp.group(1))) if pp else []
        c['plan'] = [re.sub(r'^I{1,3}\.\s*', '', sent(p)) for p in parts][:3]
        cards.append(c)

    # --- dates
    dates = []
    dz = re.search(r'## 📅[^\n]*\n([\s\S]*?)\n\n', md)
    if dz:
        for l in dz.group(1).split('\n'):
            m = re.match(r'- \*\*(.+?)\s*[—–]\s*(.+?)\*\*\s*(?:→|->)\s*(.+)', l)
            if m:
                dates.append(dict(y=clean(m.group(1)), t=clean(m.group(2)), why=sent(m.group(3))))

    # --- paradoxes
    paradoxes = []
    pz = re.search(r'## ♻️[^\n]*\n([\s\S]*?)\n\n', md)
    if pz:
        paradoxes = [sent(l[2:]) for l in pz.group(1).split('\n') if l.startswith('- ')]

    # --- banque d'angles
    angles = []
    az = re.search(r'BANK OF COLLE ANGLES[^\n]*\n([\s\S]*?)\n\n', md)
    if az:
        for l in az.group(1).split('\n'):
            if l.startswith('- '):
                q = clean(l[2:])
                angles.append(q if q.endswith('?') else q + '?')

    # --- bibliothèque de ressources
    lib = dict(watch='', read='')
    lz = re.search(r'## 📚[\s\S]*$', md)
    if lz:
        w = re.search(r'Watch[^\n]*\*\*\n- (.+)', lz.group(0))
        r = re.search(r'Read[^\n]*\*\*\n- (.+)', lz.group(0))
        lib['watch'] = clean(w.group(1)) if w else ''
        lib['read'] = clean(r.group(1)) if r else ''

    return C, dict(ef=ef, key=key_idea, cards=cards, dates=dates,
                   paradoxes=paradoxes, angles=angles, lib=lib)

# ---------------------------------------------------------------- construction des topics
def build_topic(c, tid, C, lib):
    ctx = c['contexts'][0] if c['contexts'] else c['title'].lower()
    connect = []
    for i, tag in enumerate(c['tags'][:5]):
        whys = [
            f"The press keeps returning to this topic because of {c['presswhy']} — and {tag} is one of its natural bridges." if c['presswhy'] else f"{tag.capitalize()} is one of the natural bridges from this topic.",
            f"A strong answer links {c['title'].lower()} to {tag} — that is the reflex examiners reward.",
            f"Documents on {ctx} almost always open onto {tag}.",
            f"{tag.capitalize()} gives this topic its wider significance in a colle.",
            f"Linking this to {tag} shows you see the stakes, not just the facts.",
        ]
        connect.append(dict(to=tag.capitalize(), why=whys[i % len(whys)]))
    easy = [f"In one sentence: {m.rstrip('.')}." for m in c['must'][:3]]
    inter = [f"Discuss: {o}." for o in c['openings']] or [f"Why does the press cover {ctx}?"]
    adv = c['questions'][:3]
    while len(adv) < 3 and c['paradox']:
        adv.append(f"{c['paradox'].rstrip('.')} — how do you explain it?")
    centq = adv[0] if adv else (c['plantitle'] + '?')
    prob = [
        dict(label="A tension", q=adv[0] if adv else centq),
        dict(label="The paradox", q=f"{c['paradox'].rstrip('.')} — how do you explain it?"),
        dict(label="A comparison", q=f"What does this topic reveal when set against {c['compare'].rstrip('.').lower()}?" if c['compare'] else f"How does {C['the']} compare with its neighbours here?"),
    ]
    res = []
    if c['refs']: res.append(dict(t="Culture", i=c['refs'] + "."))
    if lib['watch']: res.append(dict(t="Watch", i=lib['watch']))
    if lib['read']: res.append(dict(t="Read", i=lib['read']))
    if c['words']: res.append(dict(t="Words to drop", i=", ".join(c['words'][:6]) + "."))
    learn = " ".join(x for x in [c['enriched'], c['model']] if x)
    return dict(
        name=c['title'], ill=pick_ill(c['title']), chapter="",
        docType=f"A recent press article on {ctx}",
        observeQ="This article lands on your desk. What would you say first?",
        observeNotice=[x for x in [
            f"The press covers this because of {c['presswhy']}." if c['presswhy'] else "",
            f"Common trap: {c['trap']}" if c['trap'] else ""] if x][:2] or ["Look for the tension before the facts."],
        sentence=c['sentence'], facts5=c['must'],
        debate=centq, paradox=c['paradox'] or "Every strong topic hides a tension.",
        whyMatter=(f"At stake: {c['stakes']}." if c['stakes'] else f"This topic opens onto {', '.join(c['tags'][:3])}."),
        whyTags=c['tags'][:4], learnMore=learn or c['sentence'],
        connect=connect,
        discuss=dict(easy=easy, inter=inter, adv=adv),
        problematics=prob,
        central=dict(q=centq, plan=c['plan'] or ["Set out the facts.", "Name the tension.", "Resolve it with a wider stake."],
                     hook=c['hook'] or c['sentence']),
        res=res[:4] or [dict(t="Go further", i="Follow the national press on this topic.")],
        compare=(f"Compare with {c['compare']}." if c['compare'] else "Compare with the other English-speaking countries."))

def build_bigpicture(C, D):
    ef5 = [sent(x) for x in D['ef'][:5]]
    para = D['paradoxes'][:1]
    tags_all = sorted({t for c in D['cards'] for t in c['tags'][:2]})[:4]
    conn = [dict(to=c['title'], why=f"{c['sentence']}") for c in D['cards'][:5]]
    adv = D['angles'][:3]
    return dict(
        name="Big picture · " + C['name'], ill="flag", chapter="",
        docType=f"A press overview of {C['the']} today",
        observeQ=f"What does the press coverage reveal about how {C['the']} works?",
        observeNotice=[D['key'] or (para[0] if para else "One country, many tensions."),
                       "Every topic below connects back to this frame."],
        sentence=D['key'] or (para[0] if para else f"{C['name']} is best understood through its tensions."),
        facts5=ef5, debate=(D['angles'][0] if D['angles'] else "Where do the deepest tensions lie?"),
        paradox=(para[0] if para else "A nation is a bundle of productive contradictions."),
        whyMatter="This is the frame every document fits into — start here, then pick a topic.",
        whyTags=tags_all or ["identity", "history", "politics", "society"],
        learnMore=" ".join(D['paradoxes'][:3]),
        connect=conn,
        discuss=dict(easy=[f"In one sentence: {x.rstrip('.')}." for x in ef5[:3]],
                     inter=[f"Discuss: {a.rstrip('?')}." for a in D['angles'][3:6]] or ["Pick a paradox and unpack it."],
                     adv=adv or ["Which single tension best explains this country today?"]),
        problematics=[dict(label="A paradox", q=(para[0].rstrip('.') + " — how do you explain it?") if para else "Name the deepest paradox."),
                      dict(label="A tension", q=adv[0] if adv else "Where is the sharpest divide?"),
                      dict(label="A comparison", q=f"What makes {C['the']} distinctive among English-speaking countries?")],
        central=dict(q=(D['angles'][0] if D['angles'] else "One nation — or several?"),
                     plan=[p for p in D['paradoxes'][:3]] or ["The founding story.", "The fractures.", "The synthesis."],
                     hook=D['key'] or "Start with the tension, not the facts."),
        res=[dict(t="Watch", i=D['lib']['watch'] or "The national broadcaster."),
             dict(t="Read", i=D['lib']['read'] or "The quality national press.")],
        compare="Compare with the other countries of this atlas — the same questions, different answers.")

# ---------------------------------------------------------------- assemblage
def generate(md_path, engine_path, out_path):
    C, D = parse_dossier(md_path)
    lib = D['lib']

    ids = [f"t{i+1}" for i in range(len(D['cards']))]
    topics = {tid: build_topic(c, tid, C, lib) for tid, c in zip(ids, D['cards'])}
    topics['bigpicture'] = build_bigpicture(C, D)
    n = len(ids)
    chap2, chap3, chap4 = ids[:3], ids[3:7], ids[7:]
    for tid in chap2: topics[tid]['chapter'] = "Power & politics"
    for tid in chap3: topics[tid]['chapter'] = "Society"
    for tid in chap4: topics[tid]['chapter'] = C['name'] + " & the world"
    topics['bigpicture']['chapter'] = "Understanding " + C['name']

    acc = {tid: PALETTE[i % len(PALETTE)] for i, tid in enumerate(ids)}
    acc.update(bigpicture="#1F3A5F", regions="#1F3A5F", timeline="#1F3A5F")
    def chapsub(tids):
        out = []
        for t in tids:
            nm = topics[t]['name'].lower()
            if len(" · ".join(out + [nm])) > 58: break
            out.append(nm)
        return " · ".join(out)
    chapters = [
        dict(n="01", title="Understanding " + C['name'], sub="the big picture", topics=["bigpicture", "regions", "timeline"]),
        dict(n="02", title="Power & politics", sub=chapsub(chap2), topics=chap2),
        dict(n="03", title="Society", sub=chapsub(chap3), topics=chap3),
        dict(n="04", title=C['name'] + " & the world", sub=chapsub(chap4), topics=chap4),
    ]
    stubs = dict(regions=C['subview'], timeline=C['name'] + " timeline")

    tl = [dict(y=d['y'], t=d['t'], ill='generic',
               lines=d['why'], why="It is still a live reference in colle documents today.",
               q=f"Why does {d['t']} still matter today?", links=[]) for d in D['dates']]

    # vue subdivisions : paradoxes (UK/US traités à part)
    nations = []
    for i, p in enumerate(D['paradoxes'][:6]):
        qmatch = D['angles'][i] if i < len(D['angles']) else "Turn this paradox into a one-sentence problematic."
        nations.append(dict(nm=(p[:52] + '…') if len(p) > 54 else p, fl="♻️", acc=PALETTE[i % len(PALETTE)],
                            facts=[p, "Name the two sides of the tension — precisely."],
                            debate="A paradox is a problematic waiting to be written.",
                            q=qmatch, links=[]))

    stat = {}
    for tid in ids + ['bigpicture']:
        t = topics[tid]
        digits = [f for f in t['facts5'] if re.search(r'\d', f)]
        stat[tid] = (digits[0] if digits else t['paradox'])[:120]

    det = []
    others = [t for t in ids]
    for i, tid in enumerate(ids[:3]):
        c = D['cards'][i]
        if not c['contexts']: continue
        wrong_tid = ids[(i + 4) % n]
        wrong = (topics[wrong_tid]['whyTags'] or ['another topic'])[0].capitalize()
        opts = [[t.capitalize(), True] for t in c['tags'][:4]] + [[wrong, False]]
        det.append(dict(head="In the news: " + c['contexts'][0], opts=opts))

    drill = []
    for c in D['cards']:
        if c['trap'] and '→' in field(c['body'], '⚠️'):
            raw = field(c['body'], '⚠️')
            wrongside, rightside = raw.split('→', 1)
            drill.append(dict(f="True or false: " + clean(wrongside).rstrip('.') + "?",
                              b="Not quite — " + sent(rightside)))
        if len(drill) >= 6: break
    for c in D['cards']:
        if c['frtrap'] and len(drill) < 8:
            drill.append(dict(f="French-speaker trap", b=c['frtrap']))

    pool = [[tid, "adv", 0] for tid in ids + ['bigpicture']]

    # ---------- injection dans le moteur ----------
    h = open(engine_path, encoding='utf-8').read()

    # textes du moteur
    h = h.replace('<title>Colle Atlas — United States</title>', f"<title>Colle Atlas — {C['name']}</title>")
    h = h.replace('<span class="country">United States</span>', f'<span class="country">{C["name"]}</span>')
    h = h.replace('<div class="eyebrow">United States · your revision atlas</div>', f'<div class="eyebrow">{C["name"]} · your revision atlas</div>')
    h = h.replace('<span class="nm">United States</span>', f'<span class="nm">{C["name"]}</span>')
    h = h.replace("onclick=\"go('hub')\">← United States</button>", f"onclick=\"go('hub')\">← {C['name']}</button>")
    h = h.replace('Resume the Electoral College, or pick a topic below.', f"Resume {topics[ids[0]]['name']}, or pick a topic below.")
    h = h.replace("openTopic('elections',0)", f"openTopic('{ids[0]}',0)")
    h = h.replace('let tr={topic:"elections"', f'let tr={{topic:"{ids[0]}"')
    h = h.replace('Fresh from the US', C['news'])
    h = h.replace('?country=us&n=3', f"?country={C['code']}&n=3")
    h = h.replace('<span class="t">The four regions</span><span class="d">Northeast · South · Midwest · West</span>',
                  f'<span class="t">{C["subview"]}</span><span class="d">{C.get("subsubshort", "tap to explore")}</span>')
    h = h.replace('<div class="eyebrow">The four regions</div><h1 style="font-size:1.8rem">One nation, four Americas</h1><p class="sub">Tap a region: essential facts, the key debate, a colle question and its connections.</p>',
                  f'<div class="eyebrow">{C["subview"]}</div><h1 style="font-size:1.8rem">{C["subhero"]}</h1><p class="sub">{C["subsub"]}</p>')
    h = h.replace('A working mock-up of the US path', f"A working mock-up of the {C['name']} path")
    h = h.replace('US final challenge', f"{C['name']} final challenge")
    h = h.replace("Try The Electoral College, Race & civil rights, Guns or The American Dream.",
                  "Every topic is generated from the country dossier.")

    # correctif d'affichage des boutons explore (titre collé au sous-titre)
    h = h.replace('.ex .t{font-family:"Lexend";font-weight:600;font-size:.96rem}',
                  '.ex .t{display:block;font-family:"Lexend";font-weight:600;font-size:.96rem}')
    h = h.replace('.ex .d{font-size:.76rem;color:var(--slate)}',
                  '.ex .d{display:block;font-size:.76rem;color:var(--slate)}')

    # icônes supplémentaires
    h = h.replace('  generic:`<svg viewBox="0 0 400 200" role="img" aria-label="An open book">',
'''  crown:`<svg viewBox="0 0 400 200" role="img" aria-label="A crown"><circle cx="200" cy="100" r="78" fill="#f1e6cc"/><path d="M120 132l-10-58 38 28 12-44 12 44 12-44 12 44 38-28-10 58Z" fill="#B0791A"/><rect x="118" y="132" width="164" height="20" rx="4" fill="#33473F"/><circle cx="148" cy="78" r="6" fill="#A6432B"/><circle cx="200" cy="64" r="6" fill="#A6432B"/><circle cx="252" cy="78" r="6" fill="#A6432B"/></svg>`,
  leaf:`<svg viewBox="0 0 400 200" role="img" aria-label="A leaf"><circle cx="200" cy="100" r="78" fill="#d9ecdf"/><path d="M200 40c44 8 66 40 60 84-44 8-78-8-92-40 8-18 18-34 32-44Z" fill="#3F7A4B"/><path d="M176 148c18-30 42-52 74-66" stroke="#EFEEE6" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`,
  generic:`<svg viewBox="0 0 400 200" role="img" aria-label="An open book">''')

    def js(obj):  # JSON est du JS valide
        return json.dumps(obj, ensure_ascii=False)

    # blocs de données
    start = h.index('const ACC=');  end = h.index('const STEPS=')
    h = h[:start] + f"const ACC={js(acc)};\nconst CHAPTERS={js(chapters)};\nconst STUBS={js(stubs)};\n" + h[end:]

    start = h.index('const TOPICS={'); end = h.index('\n};', start) + 3
    h = h[:start] + f"const TOPICS={js(topics)};" + h[end:]

    start = h.index('const US_TL=['); end = h.index('];', start) + 2
    h = h[:start] + f"const US_TL={js(tl)};" + h[end:]

    start = h.index('const NATIONS=['); end = h.index('];', start) + 2
    h = h[:start] + f"const NATIONS={js(nations)};" + h[end:]

    start = h.index('const state='); end = h.index('\n', start)
    h = h[:start] + 'const state={topics:{}};' + h[end:]

    start = h.index('const STAT='); end = h.index('\n', start)
    h = h[:start] + f"const STAT={js(stat)};" + h[end:]

    start = h.index('const DET=['); end = h.index('];', start) + 2
    h = h[:start] + f"const DET={js(det)};" + h[end:]

    start = h.index('const DRILL=['); end = h.index('];', start) + 2
    h = h[:start] + f"const DRILL={js(drill)};" + h[end:]

    start = h.index('const pool=['); end = h.index('];', start) + 2
    h = h[:start] + f"const pool={js(pool)};" + h[end:]

    # VIEWTILES : libellé de la vue subdivisions
    tileds = {'gb': 'England · Scotland · Wales · NI', 'us': 'Northeast · South · Midwest · West'}.get(C['code'], 'where the best colle questions are born')
    h = h.replace('regions:{fn:"openNations()",ill:"regions",ds:"the four Americas"}',
                  f'regions:{{fn:"openNations()",ill:"regions",ds:"{tileds}"}}')

    open(out_path, 'w', encoding='utf-8').write(h)
    return C, len(topics), len(tl), len(nations), len(drill)

if __name__ == '__main__':
    C, nt, ntl, nn, nd = generate(sys.argv[1], sys.argv[2], sys.argv[3])
    print(f"{C['name']}: {nt} topics, {ntl} dates, {nn} cartes subdivisions, {nd} drill -> {sys.argv[3]}")
