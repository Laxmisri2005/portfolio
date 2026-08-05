document.addEventListener('DOMContentLoaded', function ()
{
    const reveal_targets = document.querySelectorAll(
        '.section_header, .project_details, .education_details, .coding_card, #connect_me, #about_img_placeholder'
    );

    reveal_targets.forEach(function (el, i)
    {
        el.classList.add('reveal');
        el.style.animationDelay = (i % 6) * 0.06 + 's';
    });

    const observer = new IntersectionObserver(function (entries, obs)
    {
        entries.forEach(function (entry)
        {
            if (entry.isIntersecting)
            {
                entry.target.classList.add('is_visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    reveal_targets.forEach(function (el) { observer.observe(el); });

    // Project search
    const search_input = document.getElementById('project_search');
    const no_results_el = document.getElementById('project_no_results');
    if (search_input)
    {
        const project_cards = document.querySelectorAll('.project_details');
        search_input.addEventListener('input', function ()
        {
            const query = search_input.value.trim().toLowerCase();
            let visible_count = 0;
            project_cards.forEach(function (card)
            {
                const title = card.querySelector('.project_title')?.textContent.toLowerCase() || '';
                const desc  = card.querySelector('.project_description')?.textContent.toLowerCase() || '';
                const matches = title.includes(query) || desc.includes(query);
                card.style.display = matches ? '' : 'none';
                if (matches) visible_count++;
            });
            no_results_el.style.display = (visible_count === 0) ? 'block' : 'none';
        });
    }

    // Active nav-link highlighting on scroll
    const nav_links = document.querySelectorAll('#menu_list a[href^="#"]');
    const nav_sections = Array.from(nav_links)
        .map(function (link) { return document.querySelector(link.getAttribute('href')); })
        .filter(Boolean);
    if (nav_sections.length)
    {
        const nav_observer = new IntersectionObserver(function (entries)
        {
            entries.forEach(function (entry)
            {
                if (entry.isIntersecting)
                {
                    const id = '#' + entry.target.id;
                    nav_links.forEach(function (link)
                    {
                        link.classList.toggle('active_link', link.getAttribute('href') === id);
                    });
                }
            });
        }, { threshold: 0.4 });
        nav_sections.forEach(function (section) { nav_observer.observe(section); });
    }
});

const contact_form = document.getElementById('contact_form');
if (contact_form)
{
    const submit_btn   = document.getElementById('submit');
    const status_el    = document.getElementById('form_status');

    contact_form.addEventListener('submit', function (e)
    {
        e.preventDefault();

        if (window.location.protocol === 'file:')
        {
            status_el.textContent = 'This form needs to be viewed through a real web address to send messages (it works automatically once the site is live on GitHub Pages). Opening the file directly on your computer won\'t work — see the note below for how to preview it locally.';
            status_el.className = 'error';
            return;
        }

        submit_btn.disabled = true;
        submit_btn.textContent = 'Sending…';
        status_el.textContent = '';
        status_el.className = '';

        fetch(contact_form.action, {
            method: 'POST',
            body: new FormData(contact_form),
            headers: { 'Accept': 'application/json' }
        })
        .then(function (response)
        {
            return response.json().then(function (data)
            {
                if (response.ok)
                {
                    status_el.textContent = 'Thanks! Your message has been sent — I\'ll get back to you soon.';
                    status_el.className = 'success';
                    contact_form.reset();
                }
                else
                {
                    status_el.textContent = (data && data.message)
                        ? data.message
                        : 'Something went wrong. Please try again or email me directly.';
                    status_el.className = 'error';
                }
            });
        })
        .catch(function ()
        {
            status_el.textContent = 'Network error — please try again or email me directly.';
            status_el.className = 'error';
        })
        .finally(function ()
        {
            submit_btn.disabled = false;
            submit_btn.textContent = 'Send Message';
        });
    });
}

function menu_change(x)
{
    menu_list = document.getElementsByClassName('menu_bar_list')[0]
    if(x.classList.contains("change"))
    {
        menu_list.style.visibility = 'hidden';
        x.classList.remove("change");
    }
    else
    {
        menu_list.style.visibility = 'visible';
        x.classList.add("change");
    }
}
