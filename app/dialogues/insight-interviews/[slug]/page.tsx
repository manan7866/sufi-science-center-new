import { ObservatoryHero } from '@/components/observatory-hero';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Building, Calendar, Clock, ArrowLeft, Quote } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const interviews: Record<string, Interview> = {
  'bridging-neuroscience-and-contemplative-practice': {
    slug: 'bridging-neuroscience-and-contemplative-practice',
    title: 'Bridging Neuroscience and Contemplative Practice',
    interviewee: 'Dr. Amina Hassan',
    affiliation: 'MIT Center for Neurobiological Engineering',
    themes: ['Neuroscience', 'Meditation Research', 'Personal Practice'],
    readTime: '45 min read',
    published: '2024-01-15',
    portrait: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=400',
    subtitle: 'How cutting-edge neuroscience research intersects with a lifelong Sufi practice, and what each reveals about the other.',
    introduction: `Dr. Amina Hassan occupies a rare position in contemporary science: she is both a rigorous neuroscientist at one of the world's leading research institutions and a committed practitioner of the Sufi path she has walked since childhood. Her laboratory at MIT's Center for Neurobiological Engineering investigates the neural correlates of contemplative states, using advanced fMRI and EEG methodology to map what happens in the brain during deep meditation, dhikr, and states of absorption. In this extended conversation, she reflects on twenty years of navigating two worlds that much of her professional environment considers incompatible.`,
    sections: [
      {
        heading: 'The Double Life of a Contemplative Scientist',
        content: `For the first decade of her career, Dr. Hassan kept her spiritual practice almost entirely private. "There was a period where I genuinely feared that if my colleagues knew I prayed five times a day and attended a weekly Sufi gathering, they would discount my research," she explains. "The assumption in those environments was that religiosity was a marker of cognitive bias, that you couldn't hold rigorous empirical commitments and also hold sincere faith."

The turning point came in 2014 when a senior colleague, himself a longtime meditator, published a landmark study on default mode network deactivation during mindfulness practice. The study's candid acknowledgment of the researcher's personal practice opened a door. "I watched the scientific community receive that paper with enthusiasm, not skepticism. I realised the problem had never been the practice itself. It was the fear of disclosure, and perhaps my own unexamined assumption that secular science and sacred experience were fundamentally at odds."

Since then, Dr. Hassan has been openly integrative. Her lab is explicit that its interest in contemplative neuroscience is informed by practitioners who also happen to be scientists. "We are not studying contemplative practice from the outside," she says. "Several people on my team have their own practices. That changes how you design your research questions."`,
      },
      {
        heading: 'What the Brain Data Shows, and Does Not Show',
        content: `Her research has produced findings that both confirm and complicate popular narratives about meditation and the brain. The popular press tends to focus on neuroplasticity, the capacity of sustained practice to reshape neural architecture. Dr. Hassan is careful to distinguish between what her data actually demonstrates and what advocates often claim.

"We have robust evidence that long-term practitioners of contemplative traditions show measurable differences in anterior insula thickness, in default mode network activity patterns, and in certain markers of attentional regulation. These are real findings. What we cannot say (what our methodology simply does not permit us to say) is that these differences cause the subjective experiences practitioners report, or that they are the mechanism of transformation."

The gap between neural correlate and lived meaning is, for her, both a scientific limitation and a philosophically important observation. "The Sufi tradition would say that transformation is primarily a matter of the heart (qalb), not the brain. Modern neuroscience has no instrument that measures the heart in that sense. So we are, at best, capturing shadows of a phenomenon whose centre we cannot directly observe."

This epistemic humility is itself, she suggests, something the contemplative tradition has taught her. "Years of sitting with a shaykh who consistently pointed beyond conceptual frameworks, who would refuse to let any idea, however beautiful, become a resting place, that has made me a better scientist. I hold my models more lightly."`,
      },
      {
        heading: 'Dhikr as an Object of Inquiry',
        content: `One of the distinctive features of Dr. Hassan's research programme is its focus on dhikr, the repetitive invocation of divine names, as a specific contemplative form. Most Western contemplative neuroscience has concentrated on Buddhist-derived mindfulness practices, which are perceived as more secularised and accessible to non-religious populations. Dr. Hassan has pushed deliberately against this methodological narrowing.

"Dhikr is one of the most widely practised contemplative technologies in human history, with a continuous lineage of practitioners going back fourteen centuries. The research literature on it is negligible compared with its demographic footprint. That gap is partly a legacy of the secularisation of the field, and partly, I think, a lingering Orientalism that treats Islamic practice as less amenable to scientific investigation."

Her team's studies on dhikr practitioners have found that the rhythmic, breath-coordinated repetition of divine names produces distinctive EEG signatures (in particular, enhanced gamma-band synchrony in frontal and parietal regions) that differ meaningfully from patterns observed during silent mindfulness meditation. "These are different practices with different phenomenologies. They should produce different data. The fact that they do is actually an important finding, because it pushes back against a flattening tendency in the field to treat all meditation as essentially the same."`,
      },
      {
        heading: 'On the Limits of Quantification',
        content: `Dr. Hassan is unambiguous that her most significant personal developments (what she calls "the actual work of the path") have not been measurable in her laboratory. The stations and states described in classical Sufi texts, the gradual dissolution of egocentric fixation, the moments of opening that practitioners call kashf: these are not phenomena her instruments can capture.

"I would be dishonest if I said my practice has been about achieving the brain states my research documents. My practice has been about trying to become a better human being: more sincere, more present, more in service. Those are not neurological outcomes. They are character outcomes, and character is a domain where neuroscience is largely silent."

There is a tension here she inhabits consciously. The field she has helped build, contemplative neuroscience, risks creating a reductionist narrative in which spiritual practice is valuable only insofar as it produces measurable neurological benefits. She resists this emphatically. "The brain data is interesting and it has medical applications. We're doing important work on attention disorders, on depression, on trauma recovery. That's genuinely worthwhile. But the reason practitioners across fourteen centuries engaged in these practices had almost nothing to do with optimising their neural architecture. Reducing their experience to the instrument I use to study it would be a category error of the highest order."`,
      },
      {
        heading: 'Integrating Two Epistemologies',
        content: `What does it mean in practice to hold scientific and contemplative epistemologies simultaneously? Dr. Hassan has developed her own working framework over many years of reflection and conversation with teachers, colleagues, and students.

"Science is a method for investigating the third-person dimensions of reality: the objective, the measurable, the repeatable. Contemplative tradition is a method for investigating the first-person dimensions: the subjective, the experiential, the transformative. These are not competing accounts of the same territory. They are different instruments tuned to different registers of existence."

She is wary of attempts to reconcile the two too quickly, whether through the claim that quantum physics validates Sufi cosmology or that neuroscience confirms the efficacy of prayer. "Those moves are intellectually premature and, I think, spiritually unserious. They seek a validation that the tradition does not need and that science cannot honestly provide. What interests me more is the question of what each tradition can learn from the other's methods: its disciplines of attention, its practices of correction, its communities of inquiry."

The Sufi tradition's insistence on the necessity of a living teacher (someone who has traversed the path and can see where you are with clarity you cannot yet achieve yourself) has, she suggests, an interesting structural parallel with scientific mentorship. "Good scientific training teaches you to distinguish what you actually observe from what you want to observe, what your data actually supports from what you wish it supported. A good shaykh does something structurally similar in a different domain. Both are correcting for the distortions of the self-referential mind."`,
      },
    ],
    reflections: [
      {
        heading: 'On the Gift of Discomfort',
        text: `"The most useful experiences in my career have been the ones where both my scientific assumptions and my spiritual certainties were challenged simultaneously. There have been moments in the laboratory where the data simply refused to fit any model I had, and moments on the path where my understanding of my own state was shown to be entirely self-constructed. In both cases, the correct response was the same: sit with the discomfort, release the attachment to a particular outcome, and pay closer attention."`,
      },
      {
        heading: 'On Teaching the Next Generation',
        text: `"I now tell my graduate students, early in their training, that the most important quality a scientist can cultivate is what I call epistemic humility: the genuine willingness to be wrong, to hold a finding provisionally, to resist the temptation to protect your model when the evidence is moving against it. I have learned this not only from my scientific training but from my spiritual practice. They have reinforced each other in this respect."`,
      },
      {
        heading: 'On the Future of Contemplative Science',
        text: `"What excites me most about the next twenty years of this field is not better brain imaging (though that will come) but the possibility of genuine dialogue between traditions. Not the extraction of 'universal techniques' from their contexts, stripped of meaning and repackaged for wellness markets, but actual sustained conversation between rigorous scientists and rigorous practitioners, conducted with mutual respect for the depth of both enterprises. We are early in that conversation. I hope to still be part of it."`,
      },
    ],
    closingNote: `Dr. Amina Hassan continues her research at MIT's Center for Neurobiological Engineering, where she leads the Contemplative Cognition Laboratory. She also serves as a faculty member for the Sufi Science Center's annual Summer Institute, where she offers seminars on integrating empirical inquiry and inner development.`,
  },
  'from-silicon-valley-to-sacred-service': {
    slug: 'from-silicon-valley-to-sacred-service',
    title: 'From Silicon Valley to Sacred Service',
    interviewee: 'Omar Farid',
    affiliation: 'Former VP Engineering, Now Community Organizer',
    themes: ['Technology Ethics', 'Service', 'Career Transformation'],
    readTime: '52 min read',
    published: '2023-12-08',
    portrait: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    subtitle: 'A transformation journey from tech leadership to community service, exploring how Sufi principles inform ethical technology and social change.',
    introduction: `Omar Farid spent fourteen years ascending through the ranks of Silicon Valley's most prestigious companies. By his early forties he was Vice President of Engineering at a major platform company, managing teams of over three hundred engineers, leading products used by hundreds of millions of people. Then, over the course of three years, he stepped back, resigned, and redirected his life toward community service in under-resourced neighbourhoods, work driven explicitly by the Sufi principles he had been quietly practising for over a decade. This is the story of that transition, told without romanticisation.`,
    sections: [
      {
        heading: 'The Accumulation of Dissonance',
        content: `Omar Farid does not describe his departure from the technology industry as a sudden conversion experience. "It was an accumulation," he says carefully. "A very slow accumulation of dissonance between what I was spending my professional life doing and what I believed actually mattered."

The dissonance had structural roots. At the senior levels of a large platform company, the decisions being made were not primarily technical. They were ethical, social, and political. What content should be amplified? How should addictive design patterns be balanced against user welfare? When a feature increases engagement but also increases anxiety in teenage users, what does the responsible choice look like? "I was in rooms where those questions were being asked, and I was watching the framework we used to answer them. Overwhelmingly, the framework was: what does the data say about user behaviour? What is the competitive pressure? What is the regulatory risk?"

What was largely absent from those frameworks, he reflects, was any serious engagement with the question of human flourishing. "We were not asking: what does it mean for a person to live well? What relationships and communities and practices actually support human development? Those questions felt philosophically naive inside that culture, almost embarrassingly earnest."`,
      },
      {
        heading: 'What the Tradition Was Teaching',
        content: `Throughout his technology career, Omar Farid had maintained a quiet connection to a Sufi order he had joined in his late twenties. He attended weekly gatherings, kept a practice of dhikr and reflection, and maintained a relationship with a teacher whose guidance he trusted. But for most of those years, he experienced his spiritual and professional lives as largely separate domains.

"My shaykh would ask me about my work sometimes. Not in a prying way, gently. And I noticed that I was reluctant to go into detail. I told myself it was just a different domain. But looking back, I think I was protecting the dissonance. If I brought them into real contact, something would have to change."

The teaching that finally cut through the compartmentalisation came not in a dramatic encounter but in a gradual accumulation of ordinary lessons. The Sufi concept of khidma, selfless service, and its relationship to the development of the soul had been part of his practice for years. But its implications for his professional choices had remained abstract. "At some point I started asking a very simple question: is this work, the work I am doing right now, in the service of anything beyond my own advancement and the company's growth? And I could not find a satisfying answer."`,
      },
      {
        heading: 'The Three-Year Transition',
        content: `The transition was neither abrupt nor impulsive. Over three years, Omar Farid wound down his responsibilities, negotiated his departure, and began a systematic process of discernment about what came next. He is emphatic about this deliberateness. "I am deeply suspicious of the 'I quit my job to find myself' narrative that circulates in wellness culture. That story is mostly available to people with significant financial resources and no dependents. It's also, I think, spiritually immature: the idea that you step out of the world to find meaning and then, having found it, re-enter."

His own process was more methodical. He spent extended periods volunteering with community organisations in neighbourhoods he had driven past for years without really seeing. He sought out conversations with people who had built institutions of genuine community service. He read widely in the literature on urban development, social capital, and the sociology of under-resourced communities.

"I was trying to understand what is actually needed, not what I imagined was needed, not what would allow me to feel useful, but what the communities themselves, given voice, identified as their needs. That discipline, of listening before proposing, of letting the reality of a situation teach you rather than imposing your model onto it, is something the Sufi tradition had been training me in for years. The shaykh calls it adab: a kind of disciplined attentiveness."`,
      },
      {
        heading: 'Building the Organisation',
        content: `Today Omar Farid directs a community organisation that works at the intersection of technology access, workforce development, and civic engagement in three low-income neighbourhoods in the Bay Area. The organisation employs fourteen people, serves roughly two thousand individuals annually, and has built partnerships with local schools, libraries, health clinics, and small businesses.

He applies engineering discipline to social organisation: rigorous outcome measurement, iterative design, data-informed programme adjustment, while remaining explicit about the limits of that framework. "I've seen what happens when social-sector organisations try to run on pure metrics. You end up optimising for what you can measure and systematically neglecting what you can't. The most important things, dignity, trust, genuine relationship, the slow rebuilding of a sense of agency in people who have been told repeatedly that they have none, these do not reduce to a dashboard."

The Sufi concept of hal, a momentary state of grace or opening, has informed his thinking about what genuine service looks like. "You can create conditions for transformation. You cannot manufacture it. Your role is to show up, to be present, to remove obstacles, to stay in relationship through difficulty. The outcome is not yours to control. That is an extraordinarily liberating framework for someone who spent fourteen years in an industry that believed, at its core, that everything is optimisable."`,
      },
      {
        heading: 'Technology Ethics from the Inside',
        content: `His perspective on the technology industry has sharpened in the years since he left it. He is neither a simple critic nor a nostalgic advocate. "Technology is not neutral. The platforms I helped build shaped behaviour at population scale. They reshaped attention, social relationship, political discourse, self-image. To claim that that was merely the provision of tools and the responsibility for use rests entirely with users is an ethical evasion of the first order."

He has begun speaking in industry settings about what he calls the "service question": the invitation to engineers and product leaders to ask not only what a technology does, but who it actually serves. Not in the trivial sense of user satisfaction metrics, but in the deeper sense of human development and community flourishing.

"I am not asking people to quit their jobs. I am asking them to bring the same rigour they apply to engineering challenges to ethical questions, to treat moral reasoning as a craft that can be developed, not a domain where gut instinct and social consensus are sufficient. The tradition I come from has been developing that craft for fourteen centuries. There is something to learn from it."`,
      },
    ],
    reflections: [
      {
        heading: 'On What He Misses',
        text: `"I would be dishonest if I said I don't miss aspects of that world. The intellectual calibre of the people I worked with. The sheer complexity of the problems. The pace. There is something genuinely exhilarating about building systems at scale. I sometimes feel that exhilaration in my current work, but less often, and at smaller scale. I have made peace with that."`,
      },
      {
        heading: 'On the Role of the Teacher',
        text: `"My shaykh has never once told me what career choice to make. He has consistently invited me to look more honestly at my motivations, to distinguish between what I want to do and what I am being called to do. That distinction is not always clear, and it is never made once and for all. It requires ongoing discernment. I am still in that process."`,
      },
      {
        heading: 'On Serving Without Being Seen',
        text: `"The Sufi tradition has a great deal to say about the dangers of performing service for recognition, of the ego's capacity to colonise even altruistic action and turn it into a vehicle for self-aggrandisement. I find this teaching particularly relevant in an era where service is often performed publicly, documented, and shared for social capital. I try to ask myself regularly: would I do this if no one would ever know? Sometimes the honest answer is no. That honesty is the beginning of actual work."`,
      },
    ],
    closingNote: `Omar Farid serves as Executive Director of the Bay Area Community Technology Initiative, which he co-founded in 2021. He speaks regularly at conferences on technology ethics, urban development, and the integration of contemplative practice with social change work.`,
  },
  'complexity-science-and-spiritual-emergence': {
    slug: 'complexity-science-and-spiritual-emergence',
    title: 'Complexity Science and Spiritual Emergence',
    interviewee: 'Prof. Sarah Chen',
    affiliation: 'Santa Fe Institute',
    themes: ['Complex Systems', 'Spiritual Development', 'Scientific Method'],
    readTime: '48 min read',
    published: '2023-11-20',
    portrait: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
    subtitle: 'Investigating parallels between complex adaptive systems and stages of spiritual development through rigorous scientific inquiry.',
    introduction: `Professor Sarah Chen is one of the leading figures in complexity science, a field that studies how large systems composed of many interacting parts generate emergent behaviours that are not predictable from the properties of those parts alone. Her work at the Santa Fe Institute has ranged from mathematical ecology to financial network dynamics to the study of social tipping points. For the past eight years, she has also been engaged in a sustained intellectual project that few of her colleagues know about: investigating the structural parallels between the dynamics of complex adaptive systems and the stages of inner development described in Sufi literature. In this conversation, she explains why she believes this is not a metaphor but a genuinely productive research programme.`,
    sections: [
      {
        heading: 'The Moment the Parallel Became Serious',
        content: `Professor Chen arrived at this research programme through what she describes as an "unavoidable convergence." She had been a complexity scientist for fifteen years before she began seriously engaging with Sufi literature, an engagement that began, she says, almost accidentally through a friendship with a scholar of Islamic philosophy. "He handed me a translation of al-Ghazali's Ihya Ulum al-Din, the Revival of the Religious Sciences, as a joke almost, saying 'here's your competition.' I read it and I was not amused. I was astonished."

What astonished her was the structural sophistication of al-Ghazali's account of human psychological development. "He was describing a system, the human nafs, the self, in terms that were, at a formal level, remarkably close to the language of complex adaptive systems. He was talking about feedback loops, about the interaction between different subsystems, about how small perturbations in internal state can cascade into large-scale reorganisations of the personality. He did not have that language, of course. But the underlying structural insight was there."

She spent the following two years reading extensively in classical Sufi psychology, al-Ghazali, Ibn Arabi, al-Qushayri's Risala, Rumi, alongside contemporary complexity science literature. "I kept a running list of structural correspondences. By the end of two years, the list was long enough that I thought: this is either a very interesting coincidence, or there is something here that deserves serious investigation."`,
      },
      {
        heading: 'What Complexity Science Studies',
        content: `To appreciate Professor Chen's argument, it is necessary to understand what complexity science actually claims. The field investigates systems in which large numbers of components, whether neurons, organisms, traders in a market, or cells in a tissue, interact locally according to relatively simple rules, producing global behaviours that are qualitatively different from what any individual component could produce. The canonical examples are ant colonies, immune systems, market dynamics, and ecological networks.

Key features of complex adaptive systems include: non-linearity (small changes in inputs can produce large changes in outputs); emergence (system-level properties arise that are not predictable from component-level properties); adaptation (the system modifies its own structure in response to experience); and phase transitions (systems can undergo relatively rapid reorganisations from one stable state to another when certain thresholds are crossed).

"What struck me in reading Sufi literature on spiritual development was that these formal features, non-linearity, emergence, adaptation, phase transition, appear consistently in the phenomenological descriptions. Practitioners describe their development not as linear accumulation but as a series of transformations, often preceded by periods of intense instability, that produce qualitatively new modes of experiencing and responding to the world."`,
      },
      {
        heading: 'The Maqamat as Phase Transitions',
        content: `The classical Sufi framework of maqamat, the stations of the path, including tawba (repentance), zuhd (detachment), tawakkul (trust), and so on, has typically been interpreted theologically or phenomenologically. Professor Chen's contribution is to propose an interpretation in terms of phase dynamics.

"In complex systems, a phase transition is a qualitative reorganisation of the system's structure that occurs when a control parameter crosses a critical threshold. The classic example is water transitioning from liquid to ice: a small further decrease in temperature produces not a slightly different liquid but a qualitatively different state of matter."

She proposes that the maqamat describe something structurally analogous. "Each station is not simply a quantitative increase in virtue or devotion. It is a qualitative reorganisation of the self's relationship to experience, action, and meaning. The transition between stations is often described in the literature as preceded by a period of instability, hal states, states of agitation or dissolution, that look, formally, like the critical fluctuations that precede a phase transition in a physical system."

She is careful to state what she is and is not claiming. "I am not saying that the saints were doing physics without knowing it. I am saying that the formal mathematical structures we have developed to describe certain kinds of systemic change may turn out to be applicable to the phenomenology of inner development, and that this cross-disciplinary recognition might be productive for both fields."`,
      },
      {
        heading: 'The Problem of Methodology',
        content: `The most difficult question Professor Chen faces is methodological: how do you study inner states scientifically? The first-person character of contemplative experience places it, by definition, outside the reach of standard third-person scientific methodology.

Her response to this challenge has been two-pronged. The first prong is phenomenological: working with practitioners who are trained in careful introspective description to generate detailed accounts of their experience that can then be analysed for structural features. "This is not the same as measuring brain states. It is a disciplined investigation of experiential structure using rigorous methods drawn from phenomenological philosophy, particularly the work of Husserl and Merleau-Ponty."

The second prong is computational: building formal models of inner development as dynamic systems and testing whether these models generate predictions that match observed patterns in practitioner accounts. "If my hypothesis is correct, that transitions between stations display the signatures of phase transitions, then we should be able to build models that reproduce those signatures and test them against systematically collected phenomenological data. We are early in this work, but the preliminary results are encouraging."

She acknowledges the philosophical difficulty of this enterprise. "You are trying to build a bridge between two domains, objective mathematical structure and subjective first-person experience, that most of my colleagues regard as unbridgeable. I think they are wrong about that, but I understand the scepticism. The bridge will not be built overnight."`,
      },
      {
        heading: 'What Contemplative Tradition Offers Science',
        content: `Beyond the specific research programme, Professor Chen has a broader argument about what contemplative traditions offer contemporary science. It is not, she insists, mystical content or revealed truth. It is methodology.

"Sufi tradition, at its best, is a rigorous empirical programme for investigating first-person reality. It has developed, over fourteen centuries, careful methods for observing inner states, for distinguishing genuine development from self-deception, for correcting for the systematic distortions of the ego-driven mind. These are epistemological achievements that deserve to be taken seriously."

She contrasts this with what she sees as the superficial assimilation of contemplative practice into wellness culture. "Mindfulness as it is currently deployed in corporate settings and health apps has stripped the practice of its epistemological seriousness. It has retained the technique, the instruction to observe your breath, to notice thoughts without attachment, while discarding the framework within which that technique makes sense: the recognition that the ordinary mind systematically misrepresents reality and that correcting for this misrepresentation requires sustained effort within a structured community of inquiry guided by those who have progressed further on the path."

That epistemological framework, she argues, is precisely what science most needs to learn from the contemplative tradition: "not its metaphysics, not its theology, but its disciplined humility about the distortions introduced by unexamined subjectivity."`,
      },
    ],
    reflections: [
      {
        heading: 'On Being Taken Seriously',
        text: `"I have had colleagues respond to this work with polite dismissal: the assumption that I have been seduced by romantic ideas and that the 'parallels' I am describing are superficial metaphors, not structural correspondences. That is a fair challenge and I take it seriously. The answer is in the rigour of the methodology and the specificity of the predictions. I am not asking anyone to accept my conclusions on faith. I am asking them to engage with the evidence."`,
      },
      {
        heading: 'On Her Own Practice',
        text: `"I am not a practitioner of the Sufi path in any formal sense. I have relationships with teachers and practitioners who have been extraordinarily generous in helping me understand the tradition from the inside, but I hold the practitioner role with great care. It would be dishonest to claim a status I have not earned. What I can say is that the study of this tradition has changed how I engage with my own scientific work, more attentively, more humbly, more aware of the degree to which my models are maps and not territories."`,
      },
      {
        heading: 'On the Long Horizon',
        text: `"The project I am working on will not be completed in my career. I am contributing one set of tools and one set of observations to a conversation that will need many different kinds of intelligence over many decades. That is not a discouraging thought. It is, actually, one of the things the complexity tradition and the contemplative tradition agree on: large-scale emergent transformation requires patience, and its outcomes cannot be engineered from above."`,
      },
    ],
    closingNote: `Professor Sarah Chen is a resident faculty member at the Santa Fe Institute and an affiliate professor at the University of New Mexico's Department of Mathematics. Her current research programme, 'Phase Dynamics of Inner Development,' is the subject of a forthcoming book co-authored with scholars in philosophy, Islamic studies, and computational neuroscience.`,
  },
};

interface Section {
  heading: string;
  content: string;
}

interface Reflection {
  heading: string;
  text: string;
}

interface Interview {
  slug: string;
  title: string;
  interviewee: string;
  affiliation: string;
  themes: string[];
  readTime: string;
  published: string;
  portrait: string;
  subtitle: string;
  introduction: string;
  sections: Section[];
  reflections: Reflection[];
  closingNote: string;
}

export async function generateStaticParams() {
  return Object.keys(interviews).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const interview = interviews[params.slug];
  if (!interview) return {};
  return {
    title: `${interview.title} | Insight Interviews | Sufi Science Center`,
    description: interview.subtitle,
  };
}

export default function InterviewDetailPage({ params }: { params: { slug: string } }) {
  const interview = interviews[params.slug];
  if (!interview) notFound();

  return (
    <div className="min-h-screen pt-20 bg-[#0B1120]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/dialogues/insight-interviews">
          <Button variant="ghost" className="text-[#AAB0D6] hover:text-[#F5F3EE] mb-8 -ml-2 group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Insight Interviews
          </Button>
        </Link>

        <div className="mb-4 flex flex-wrap gap-2">
          {interview.themes.map((theme, i) => (
            <Badge key={i} variant="outline" className="border-[#C8A75E]/30 text-[#C8A75E] text-xs">
              {theme}
            </Badge>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#F5F3EE] leading-tight mb-6">
          {interview.title}
        </h1>

        <p className="text-xl text-[#AAB0D6] leading-relaxed mb-10 font-light border-l-2 border-[#C8A75E]/40 pl-5">
          {interview.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#C8A75E]/30">
              <img
                src={interview.portrait}
                alt={interview.interviewee}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center text-[#C8A75E] mb-1">
                <User className="w-4 h-4 mr-2" />
                <span className="font-semibold">{interview.interviewee}</span>
              </div>
              <div className="flex items-center text-[#AAB0D6]">
                <Building className="w-4 h-4 mr-2" />
                <span className="text-sm">{interview.affiliation}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#AAB0D6]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{interview.published}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{interview.readTime}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-12" />

        <div className="prose prose-invert max-w-none">
          <p className="text-[#C8C6C0] text-lg leading-[1.85] mb-12 font-light">
            {interview.introduction}
          </p>

          {interview.sections.map((section, i) => (
            <div key={i} className="mb-14">
              <h2 className="text-2xl font-semibold text-[#F5F3EE] mb-6 font-serif">
                {section.heading}
              </h2>
              {section.content.split('\n\n').map((para, j) => (
                <p key={j} className="text-[#C8C6C0] leading-[1.85] mb-5 font-light">
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>

        <Separator className="bg-white/10 my-14" />

        <div className="mb-14">
          <h2 className="text-2xl font-semibold text-[#F5F3EE] mb-8 font-serif">
            Reflections
          </h2>
          <div className="space-y-8">
            {interview.reflections.map((reflection, i) => (
              <div key={i} className="glass-panel rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <Quote className="w-8 h-8 text-[#C8A75E]/50 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#C8A75E] uppercase tracking-widest mb-3">
                      {reflection.heading}
                    </h3>
                    <p className="text-[#C8C6C0] leading-[1.85] font-light italic">
                      {reflection.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-white/10 mb-10" />

        <div className="glass-panel rounded-2xl p-8 bg-gradient-to-br from-[#C8A75E]/5 to-transparent border-[#C8A75E]/10">
          <p className="text-[#AAB0D6] leading-relaxed text-sm font-light">
            {interview.closingNote}
          </p>
        </div>

        <div className="mt-14 pt-10 border-t border-white/10 flex items-center justify-between">
          <Link href="/dialogues/insight-interviews">
            <Button variant="ghost" className="text-[#AAB0D6] hover:text-[#F5F3EE] group">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Interviews
            </Button>
          </Link>
          <Link href="/dialogues/insight-interviews/apply">
            <Button className="bg-[#C8A75E] hover:bg-[#C8A75E]/90 text-[#0B1120]">
              Apply to Participate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
