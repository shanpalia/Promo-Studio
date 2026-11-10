import 'package:flutter/material.dart';

void main() => runApp(const PromoStudioApp());

const mint = Color(0xFF0E9F78);
const ink = Color(0xFF14231F);
const pale = Color(0xFFE3F8EF);

class PromoStudioApp extends StatelessWidget {
  const PromoStudioApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Promo Studio',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF7FAF8),
        colorScheme: ColorScheme.fromSeed(seedColor: mint, brightness: Brightness.light),
        fontFamily: 'Roboto',
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int selected = 0;
  final items = const ['Home', 'Templates', 'Projects', 'Profile'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFFF7FAF8),
        titleSpacing: 20,
        title: const Row(children: [
          CircleAvatar(backgroundColor: ink, child: Text('PS', style: TextStyle(color: pale, fontWeight: FontWeight.bold))),
          SizedBox(width: 11),
          Text('Promo Studio', style: TextStyle(color: ink, fontWeight: FontWeight.w800, fontSize: 19)),
        ]),
        actions: [IconButton(onPressed: () {}, icon: const Icon(Icons.notifications_none_rounded)), const SizedBox(width: 8)],
      ),
      body: SafeArea(child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 14, 20, 28),
        children: [
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(26),
              gradient: const LinearGradient(colors: [Color(0xFFDDF8EC), Color(0xFFBDEED9)], begin: Alignment.topLeft, end: Alignment.bottomRight),
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('CREATE · EDIT · PROMOTE', style: TextStyle(color: mint, fontWeight: FontWeight.w800, letterSpacing: 1.2, fontSize: 11)),
              const SizedBox(height: 12),
              const Text('Bring your ideas\nto the screen.', style: TextStyle(fontSize: 31, height: 1.12, fontWeight: FontWeight.w800, color: ink)),
              const SizedBox(height: 10),
              const Text('Create beautiful promotional videos in one studio.', style: TextStyle(color: Color(0xFF536B61), height: 1.5)),
              const SizedBox(height: 20),
              FilledButton.icon(
                onPressed: () => _showMessage(context, 'Editor workspace is the next development milestone.'),
                icon: const Icon(Icons.add_rounded),
                label: const Text('Create a video'),
                style: FilledButton.styleFrom(backgroundColor: ink, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14)),
              ),
            ]),
          ),
          const SizedBox(height: 28),
          const Text('Your workspace', style: TextStyle(fontSize: 21, fontWeight: FontWeight.w800, color: ink)),
          const SizedBox(height: 14),
          Row(children: [
            Expanded(child: _quickCard(Icons.auto_awesome_rounded, 'AI Studio', 'Create concepts')),
            const SizedBox(width: 12),
            Expanded(child: _quickCard(Icons.view_timeline_rounded, 'Timeline', 'Edit your video')),
          ]),
          const SizedBox(height: 12),
          Row(children: [
            Expanded(child: _quickCard(Icons.folder_open_rounded, 'My Projects', 'Continue editing')),
            const SizedBox(width: 12),
            Expanded(child: _quickCard(Icons.palette_outlined, 'Brand Kit', 'Your brand assets')),
          ]),
          const SizedBox(height: 28),
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            const Text('Popular templates', style: TextStyle(fontSize: 21, fontWeight: FontWeight.w800, color: ink)),
            TextButton(onPressed: () => setState(() => selected = 1), child: const Text('See all')),
          ]),
          const SizedBox(height: 8),
          SizedBox(height: 150, child: ListView(scrollDirection: Axis.horizontal, children: const [
            _TemplateCard(title: 'Product launch', subtitle: 'Showcase your best', colors: [Color(0xFFF3C9A4), Color(0xFFD98569)], icon: Icons.shopping_bag_outlined),
            _TemplateCard(title: 'Business promo', subtitle: 'Tell your story', colors: [Color(0xFFB8D9D0), Color(0xFF5E9E88)], icon: Icons.campaign_outlined),
            _TemplateCard(title: 'Social reel', subtitle: 'Made for vertical', colors: [Color(0xFFC8C5F1), Color(0xFF817AC7)], icon: Icons.smartphone_rounded),
          ])),
        ],
      )),
      bottomNavigationBar: NavigationBar(
        selectedIndex: selected,
        onDestinationSelected: (value) => setState(() => selected = value),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home_rounded), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.grid_view_rounded), label: 'Templates'),
          NavigationDestination(icon: Icon(Icons.folder_outlined), label: 'Projects'),
          NavigationDestination(icon: Icon(Icons.person_outline_rounded), label: 'Profile'),
        ],
      ),
    );
  }

  Widget _quickCard(IconData icon, String title, String subtitle) => Expanded(child: InkWell(
    borderRadius: BorderRadius.circular(18),
    onTap: () => _showMessage(context, '$title will be implemented in the next milestone.'),
    child: Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18), border: Border.all(color: const Color(0xFFE8EFEC))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Container(width: 42, height: 42, decoration: BoxDecoration(color: pale, borderRadius: BorderRadius.circular(13)), child: Icon(icon, color: mint)),
        const SizedBox(height: 13),
        Text(title, style: const TextStyle(fontWeight: FontWeight.w800, color: ink)),
        const SizedBox(height: 4),
        Text(subtitle, style: const TextStyle(fontSize: 12, color: Color(0xFF71817B))),
      ]),
    ),
  ));
}

class _TemplateCard extends StatelessWidget {
  final String title, subtitle;
  final List<Color> colors;
  final IconData icon;
  const _TemplateCard({required this.title, required this.subtitle, required this.colors, required this.icon});
  @override
  Widget build(BuildContext context) => Container(
    width: 220, margin: const EdgeInsets.only(right: 12), padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(gradient: LinearGradient(colors: colors), borderRadius: BorderRadius.circular(20)),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Icon(icon, color: Colors.white, size: 28),
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 17)),
        Text(subtitle, style: const TextStyle(color: Colors.white70, fontSize: 12)),
      ]),
    ]),
  );
}

void _showMessage(BuildContext context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
}
